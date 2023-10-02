const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');

router.post('/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirectUrl = 'http://localhost:3030/oauth';

    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_Id,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    );

    const authorizedUrl = oauth2Client.generateAuthUrl({
        access_type : "offline", // will return a refresh token
        scope: 'openid',
        prompt: 'consent'
    });

    res.json({url:authorizedUrl});
});

module.exports = router;