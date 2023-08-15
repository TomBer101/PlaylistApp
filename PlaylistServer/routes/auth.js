const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const {Strategy: FacebookStrategy} = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth');

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({email});
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword});
        await user.save();

        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if (!user ||!await bcrypt.compare(password, user.password)) {
            return res.status(403).json({message:'Invalid credentials'})
        }
        const token = jwt.sign({ userId: user.id}, 'my-secret-key'); // TODO: what would id be and where to define?
        res.json({ token }); // explanation of the token.
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:"Internal server error"});
    }
});