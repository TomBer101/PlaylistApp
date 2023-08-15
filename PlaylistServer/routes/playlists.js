const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const Playlist = require('../models/Playlist');
const router = express.Router();
require('dotenv').config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })
router.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


router.get('/scanned/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        const playlist = await Playlist.findById(entryId);
        if (!playlist) {
            return res.status(400).json({ error: 'Invalid QR code.'});
        }

        if (playlist.edited) {
            return res.status(200).json({
                pageType: 'listener',
                data: {
                    name: playlist.name,
                    songs: playlist.songs,
                    coverImage: playlist.coverImage,
                },
                id: entryId,
            });
        }

        if (playlist.scanned) {
            return res.status(400).json({error: "The playlist is being edited."});
        } else {
            playlist.scanned = true;
            await playlist.save();
            res.status(200).json({
                pageType: 'creator',
                data: playlist,
                id: entryId,
            })
        }
    } catch (error) {
        console.error('Error in scanning route: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});



router.get('/search', async (req, res) => {

    const apiKey = process.env.YOUTUBE_KEY;
    const songName = req.query.q;
    const nextPageToken = req.query.nextPageToken || '';

    try {
        console.log('Song: ', songName);
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${songName}&part=snippet&type=video&maxResults=5&pageToken=${nextPageToken}`
        );
        
        const result = response.data.items.map(item => {
            return {
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                id: item.id.videoId,
            };
        });

        res.status(200).json(result);

    } catch (error) {
        console.error("Error searching song: ", error);
        res.status(500).json({error: 'An error searching song'});
    }
});


router.post('/add-song/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {songs} = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        playlist.songs = songs;
        await playlist.save();
        res.status(200).json({message: 'Songs saved successfully'});
                
    } catch (error) {
        console.error('Error saving songs: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/change-name/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {name} = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        playlist.name = name;
        await playlist.save();
        res.status(200).json({message: 'The name was changed successfully.'});

    } catch (error) {
        console.error(('Error changing name: ', error));
        res.status(500).json({error:'Internal server error'});
    }
})



router.post('select-image/:playlistId', upload.single('image'), async (req, res) => {
    try{
        const {playlistId} = req.params;
        const { imageName } = req.file.filename;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }



    } catch (error) {

    }
})


module.exports = router;

