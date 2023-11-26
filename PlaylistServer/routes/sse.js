const express = require('express');
const events = require('events');

const router = express.Router();

const playlistUpdateEmitter = new events.EventEmitter();

router.get('/playlistsupdates', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(':ok\n\n');

  const updateListener = (playlistData) => { 
    console.log('the data from the see.js: ', playlistData);
    res.write(`data: ${JSON.stringify({ type: 'update', playlistData })}\n\n`);
  };

  playlistUpdateEmitter.on('playlist_updated', updateListener);

  req.on('close', () => {
    playlistUpdateEmitter.off('playlist_updated', updateListener);
  });
});

module.exports = {router, playlistUpdateEmitter};
