const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User', // reference to the User model (which is defined in another file)
        required:true
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            required: true,
        },
    }],
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
    scanned: {
        type: Boolean,
        default: false,
    },
});

playlistSchema.path('songs').validate((songs) => {
    return songs.length <= process.env.MAX_SONGS;
}, 'Playlist can jave maximum of ${process.env.MAX_SONGS} songs.');

module.exports = mongoose.model('Playlist', playlistSchema);