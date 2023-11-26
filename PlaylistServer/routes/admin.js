const express = require('express');
const QRcode = require('qrcode');
const mongoose = require('mongoose');
const router = express.Router();

const Playlist = require('../models/Playlist');
const { log } = require('console');


router.post('/create', async (req, res) => {
    try {

        const newPlaylist = new Playlist({
            _id: new mongoose.Types.ObjectId(),
        });

        const savedPlaylist = await newPlaylist.save();
        const playlistId = savedPlaylist._id.toString();
        const clientDomain = req.headers.origin;
        const url = `http://${clientDomain}/playlist-page?playlistId=${playlistId}`;

        const qrCodeUrl = QRcode.toDataURL(url, async (err, code) => {
            savedPlaylist.qrCode = code;
            await savedPlaylist.save();

            console.log('====================================');
            console.log('Created playlist: ', playlistId);
            console.log('====================================');

            res.status(200).json({code, playlistId});
        });
    } catch (error) {
        console.log('Error generating QR: ', error);
        res.status(500).json({error: "Failed generating QR code."});
    }
});

router.get('/showplaylists', async (req, res) => {
    try {
        const playlists = await Playlist.find({edited: true}, '_id name coverImage'); 
        res.status(200).json(playlists);
    } catch (error) {
        console.error('Error getting all playlists:', error);
        res.status(500).json({error: 'Failed to retrieve playlists'});
    }
});

router.get('/qr-code/:playlistId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({error: 'Playlist not found'});
        }
        console.log(`Requested playlist: ${playlist._id}, name: ${playlist.name}`);
        res.status(200).json(playlist.qrCode); 
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Something went wrong fetching the QR code."});
    }
});



module.exports = router;