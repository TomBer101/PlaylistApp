const Admin = require('../models/Admin');
const { createSecretToken } = require('../utils/SecretToken');
const bcrypt = require('bcrypt')

module.exports.Signup = async (req, res, next) => {
    try{
        console.log('Try to signup');
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.json({ message: 'Admin already exists.' });
        }

        const admin = await Admin.create({ email, password});
        const token = createSecretToken(admin._id);
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: 'Admin signed in successfully', success: true, admin});
        next();
    } catch (err) {
        console.error(err);
    }
};

module.exports.Login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are requied' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({ message: 'Incorrect email.'});
        }

        const auth = await bcrypt.compare(password, admin.password);
        if (!auth) {
            return res.json({ message: 'Incorrect password.'});
        }

        const token = createSecretToken(admin._id);
        res.cookie("token", token, {
            withCredentials:true ,
            httpOnly :false,
        });
        res.status(201).json({ message: 'Admin loggedd in successfully', success: true});
        next();
    } catch (err) {
        console.error(err);
    }
};