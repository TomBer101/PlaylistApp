const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Playlist = require('../models/Playlist');
const router = express.Router();
const events = require('events');
require('dotenv').config();
const { playlistUpdateEmitter } = require('./sse');



router.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now()
      cb(null, "/uploads-" + file.originalname + '-' + Date.now());
    }
  });

const upload = multer({ storage: storage })


router.get('/scanned/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        console.log('Entry ID: ', entryId);
        const playlist = await Playlist.findById(entryId);
        if (!playlist) {
            return res.status(400).json({ error: 'Invalid QR code.'});
        }

        let pageType;
        if (playlist.edited) {
            pageType = "listener";
        } else {
            pageType = "creator"; 
        }

        return res.status(200).json({
            pageType: pageType,
            data: {
                name: playlist.name,
                songs: playlist.songs,
                coverImage: playlist.coverImage,
            },
            id: entryId,
        });


    } catch (error) {
        console.error('Error in scanning route: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});



router.post('/update-songs/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {songs} = req.body;

        console.log('Updated songs: ', songs);

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

router.get('/get-songs/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const playlist = await Playlist.findById(playlistId);
        
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        return res.status(200).json({songs:playlist.songs});
    } catch (error) {
        console.error('Error in scanning route: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post('/change-name/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {name} = req.body;
        console.log(req.body);
        console.log(playlistId);
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }
        console.log(name);
        playlist.name = name;
        await playlist.save();
        res.status(200).json({message: 'The name was changed successfully.'});

    } catch (error) {
        console.error(('Error changing name: ', error));
        res.status(500).json({error:'Internal server error'});
    }
})



router.post('/upload-image/:playlistId', upload.single('image'), async (req, res) => {
    try{
        const {playlistId} = req.params;
        
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        if (playlist.coverImage && playlist.coverImage.startsWith('/uploads')) {
            fs.unlinkSync('public/uploads' + playlist.coverImage);
        }

        playlist.coverImage = req.file.filename;
        await playlist.save();
        res.status(200).json({message: 'I got you image;)'})

    } catch (error) {
        console.error(" uploading image: ", error);
    }
})

router.post('/select-image/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {imageName} = req.body;
        console.log('Imagename from request: ', imageName);
        console.log('Playlist ID: ', playlistId);

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        if (playlist.coverImage && playlist.coverImage.startsWith('/uploads-')) {
            fs.unlinkSync('public/uploads' + playlist.coverImage);
        }

        playlist.coverImage = imageName;
        await playlist.save();

        res.status(200).json({message: 'Image updated.'});
    } catch (error) {
        console.error('Error updating image.', error);
        res.status(500).json({error: 'Internal server error.'});
    }
});

router.post('/save/:playlistId', async (req, res) => {
    try {
        const {playlistId} = req.params;
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }

        playlist.edited = true;
        await playlist.save();

        const message = {
            name: playlist.name,
            _id: playlist.id,
            coverImage: playlist.coverImage
        };
        playlistUpdateEmitter.emit('playlist_updated', message);

        res.status(200).json({message: 'Playlist was saved.'});
    } catch (error) {
        console.error('Error saving playlist.', error);
        res.status(500).json({error: 'Internal server error.'});
    }
})


module.exports = router;

