const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
require('dotenv').config();

module.exports.userVerification  = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(404).send({ error:'must be logged in. '});
    }

    const token = authorization.replace("Bearer ","");
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(403).send("Could not verify token.");
        }

        const {email} = payload;
        console.log(email);
        req.user = payload;
    });
    next();
};