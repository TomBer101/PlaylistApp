const express = require('express');
const events = require('events');

const router = express.Router();

// SSE event emitter setup
const playlistUpdateEmitter = new events.EventEmitter();

// SSE endpoint to send updates to connected clients
router.get('/playlistsupdates', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a comment to keep the connection open
  res.write(':ok\n\n');

  // Event listener to send updates to connected clients
  const updateListener = (playlistData) => { //{id, name, image}
    console.log('the data from the see.js: ', playlistData);
    res.write(`data: ${JSON.stringify({ type: 'update', playlistData })}\n\n`);
  };

  playlistUpdateEmitter.on('playlist_updated', updateListener);

  // Clean up event listener when the client disconnects
  req.on('close', () => {
    playlistUpdateEmitter.off('playlist_updated', updateListener);
  });
});

module.exports = {router, playlistUpdateEmitter};
