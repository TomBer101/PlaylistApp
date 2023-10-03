require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: 'access-control-allow-origin,content-type',
}));


app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static('public'));

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/admin', require('./routes/admin'));


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