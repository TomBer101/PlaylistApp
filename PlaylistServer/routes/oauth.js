const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');

async function getUserData(accessToken) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${accessToken}`);
    const data = await response.json();
    console.log('Data= ', data);
}

router.get('/', async (req, res, next) => {
    const code = req.query.code;
    try{
        const redirectUrl = 'http://localhost:3030/oauth';
        const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_Id,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );

        const result = await oauth2Client.getToken(code);
        await oauth2Client.setCredentials(result.tokens);
        console.log('Tokens acquierd');
        const user = oauth2Client.credentials;
        console.log('credentials: ', user);
        await getUserData(user.access_token);
    } catch (err) {
        console.error(('Error with signing in with google: ', err));
    }
});

module.exports = router