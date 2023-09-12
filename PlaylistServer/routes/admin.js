const express = require('express');
const QRcode = require('qrcode');
const mongoose = require('mongoose');
const router = express.Router();
const os = require('os');

const Playlist = require('../models/Playlist');
let sreverIP;



function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  const interfaceNames = Object.keys(networkInterfaces);

  for (const interfaceName of interfaceNames) {
    const networkInterface = networkInterfaces[interfaceName];

    for (const entry of networkInterface) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address;
      }
    }
  }

  return null;
}

const localIP = getLocalIP();

router.post('/create', async (req, res) => {

    //localip would be replace with the domain that would be provided for the client app.

    try {
        const newPlaylist = new Playlist({
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
        });
        const savedPlaylist = await newPlaylist.save();
        const playlistId = savedPlaylist._id.toString();
        const url = `http://${localIP}:3000/playlist-page?playlistId=${playlistId}`;

        const qrCodeUrl = QRcode.toDataURL(url, async (err, code) => {
            savedPlaylist.qrCode = code;
            await savedPlaylist.save();
            res.status(200).json(code);
        });
    } catch (error) {
        console.log('Error generating QR: ', error);
        res.status(500).json({error: "Failed generating QR code."});
    }
});

router.get('/showplaylists', async (req, res) => {
    try {
        const playlists = await Playlist.find({}, '_id name coverImage'); 
        res.json(playlists);
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

        res.json(playlist.qrCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Something went wrong fetching the QR code."});
    }
});


module.exports = router;