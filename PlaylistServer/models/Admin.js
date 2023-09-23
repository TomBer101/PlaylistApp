const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    email: {
        type : String,
        required : [true, 'Email is required'],
        unique: true,
    }, 
    password: {
        type :String ,
        required :[true, 'password is required'],
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
        default: null,
    },
});

adminSchema.pre('save' , async function() {
    this.password = await bcrypt.hash(this.password, 12);
});

// Create the shared Playlist model using the schema
const Admin = mongoose.model('Admin', adminSchema);

// Export the model
module.exports = Admin;
