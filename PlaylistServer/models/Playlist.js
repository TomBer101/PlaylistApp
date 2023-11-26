const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name : {
    type: String,
    required: false
  },
  songs: {
    type: [ String ], 
    default: [null, null, null]
  },
  edited: {
    type: Boolean,
    default:false,
  },
  scanned: {
    type: Boolean,
    default: false,
  },
  qrCode : { 
    type: String,
    required: false,
    unique: false,
  },
  coverImage: {
     type: String,
     default: '/images/default.jpg',
    },
    _id: mongoose.Schema.Types.ObjectId,
});

playlistSchema.pre('save', function (next) {
  if (this.songs.length > 3) {
    return next(new Error('Playlist cannot have more than 3 songs.'));
  }
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
