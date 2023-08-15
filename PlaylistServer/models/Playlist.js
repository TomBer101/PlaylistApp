const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name : {
    type: String,
    required: false
  },
  songs: [
    {
      title: {type: String, required: true},
      trackId: { type: String, required: true},
    }
  ],
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
     default: 'http://localhost:5000/images/default.jpg',
    },
    creatorId: {
      type:String,
      default: null
    },
    _id: mongoose.Schema.Types.ObjectId,
});

playlistSchema.pre('save', function (next) {
  if (this.songs.length > 3) {
    return next(new Error('Playlist cannot have more than 3 songs.'));
  }
  next();
});

// Create the shared Playlist model using the schema
const Playlist = mongoose.model('Playlist', playlistSchema);

// Export the model
module.exports = Playlist;
