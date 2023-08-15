require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser')

// const cookieParser = require('cookie-parser');
// const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/playlists', require('./routes/playlists'));
// app.use(cookieParser());
// app.use(
//     session({
//         secret: 'temporary-secret',
//         resave: false,
//         saveUninitialized: true,
//     })
// );

// mongoose.connect('mongodb://localhost:27017/playlistApp',{
//     useNewUrlParser: true,
//     useUnifiedTopology:true
// })
//     .then(() => {
//         console.log(`Connected to database`);
//     })
//     .catch((error) => {
//         console.log(`${error} occured while connecting to the database.`);
//     });

mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
    .then(() => {
        console.log(`Connected to database`);
    })
    .catch((error) => {
        console.log(`${error} occured while connecting to the database.`);
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});