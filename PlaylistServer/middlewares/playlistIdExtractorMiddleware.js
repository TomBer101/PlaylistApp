// playlistMiddleware.js

const Playlist = require('../models/Playlist'); // Import your Playlist model

const extractPlaylist = async (req, res, next) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is missing in the request parameters' });
  }

  console.log('====================================');
  console.log(`Request's playlist: ${playlistId}`);
  console.log('====================================');

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    req.playlist = playlist;
    next();
  } catch (error) {
    console.error('Error retrieving playlist.', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  extractPlaylist,
};
