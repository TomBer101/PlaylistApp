const express = require('express');
const fs = require('fs');
const Playlist = require('../models/Playlist');
const router = express.Router();
require('dotenv').config();
const { playlistUpdateEmitter } = require('./sse');
const { upload, router: uploadRouter } = require('../middlewares/uploadMiddleware');
const { extractPlaylist } = require('../middlewares/playlistIdExtractorMiddleware');


router.use('/upload', uploadRouter);


router.get('/scanned/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { playlist } = req;

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
            id: playlist._id,
        });


    } catch (error) {
        console.error('Error in scanning route: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/update-songs/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { songs } = req.body;
        const { playlist } = req;

        playlist.songs = songs;
        await playlist.save();
        console.log(`Playlist ${playlist._id} songs has been updated.`)

        res.status(200).json({ message: 'Songs saved successfully' });

    } catch (error) {
        console.error('Error saving songs: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-songs/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { playlist } = req;
        return res.status(200).json({ songs: playlist.songs });
    } catch (error) {
        console.error('Error in scanning route: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/change-name/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { name } = req.body;
        const { playlist } = req;

        playlist.name = name;
        await playlist.save();
        console.log(`Playlist ${playlist._id} name changed to: ${name}.`)

        res.status(200).json({ message: 'The name was changed successfully.' });

    } catch (error) {
        console.error(('Error changing name: ', error));
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/upload-image/:playlistId', extractPlaylist, upload.single('image'), async (req, res) => {
    try {
        // const {playlistId} = req.params;

        // const playlist = await Playlist.findById(playlistId);
        // if (!playlist) {
        //     return res.status(404).json({error: 'Playlist not found'});
        // }

        const { playlist } = req;

        if (playlist.coverImage && playlist.coverImage.startsWith('/uploads')) {
            fs.unlinkSync('public/uploads' + playlist.coverImage);
        }

        playlist.coverImage = req.file.filename;
        await playlist.save();
        res.status(200).json({ message: `Playlist ${playlist._id} was changes successfully.` })
        console.log(`Playlist ${playlist._id} image changed to: ${req.file.filename}.`)

    } catch (error) {
        console.error(" uploading image: ", error);
        res.status(500).json({ message: 'Internal server error, could not upload the image.' });
    }
})

router.post('/select-image/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { imageName } = req.body;
        const { playlist } = req;
        console.log('Imagename from request: ', imageName);

        if (playlist.coverImage && playlist.coverImage.startsWith('/uploads-')) {
            fs.unlinkSync('public/uploads' + playlist.coverImage);
        }

        playlist.coverImage = imageName;
        await playlist.save();
        console.log(`Playlist ${playlist._id} image changed to: ${imageName}.`)

        res.status(200).json({ message: `Playlist's ${playlist._id} has changed successfully.` });
    } catch (error) {
        const { playlistId } = req.params;
        console.error(`Error updating image for playlist: ${playlistId}`, error);
        res.status(500).json({ error: `Internal server error: could not change playlist ${playlistId} image successfully.` });
    }
});

router.post('/save/:playlistId', extractPlaylist, async (req, res) => {
    try {
        const { playlist } = req;

        playlist.edited = true;
        await playlist.save();

        const message = {
            name: playlist.name,
            _id: playlist.id,
            coverImage: playlist.coverImage
        };
        playlistUpdateEmitter.emit('playlist_updated', message);

        console.log(`Playlist ${playlist._id} has been successfully saved and published.`);
        res.status(200).json({ message: 'Playlist was saved.' });
    } catch (error) {
        const { playlistId } = req.params;
        console.error('Error saving playlist.', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;

