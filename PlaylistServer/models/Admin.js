const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-find-or-create');


const adminSchema = new mongoose.Schema({
    userName: {
        type : String,
    }, 
    password: {
        type :String ,
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
        default: null,
    },
    googleId: String,
});

adminSchema.plugin(passportLocalMongoose);
adminSchema.plugin(findOrCreate);

// Create the shared Playlist model using the schema
const Admin = mongoose.model('Admin', adminSchema);

// Export the model
module.exports = Admin;
