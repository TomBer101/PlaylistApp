const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Song', songSchema);