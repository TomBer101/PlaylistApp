require('../utils/oauth');
const passport = require('passport');
const Admin = require('../models/Admin');

const { createSecretToken } = require('../utils/SecretToken');
const bcrypt = require('bcrypt');

module.exports.Signup = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        console.log(`email: ${email}, pass: ${password}`);

        Admin.register({username: email}, password, function(err, admin) {
            if(err){
                console.log("ERROR in singup:" + err);
                res.status(400).json({url: 'signup', message: 'sign up failed'});
            } else {
                passport.authenticate("local")(req, res, function(){
                    console.log(req.isAuthenticated());
                    res.status(200).json({url: '/'});
                });
            }
        });
    } catch (err) {
        console.error('Error signup: ', err);
    }
}

module.exports.Login = async (req, res, next) => {
    try{
        const admin = new Admin({
            email: req.body.email,
            password: req.body.password
        });
    
        req.login(admin, function(err){
            if(err){
                console.log("ERROR:" + err);
                res.send('/login');
            } else {
                passport.authenticate("local")(req, res, function(){
                    res.send('/');
                });
            }
        });
    } catch (err) {
        console.error('Error login: ', err);
    }
}

module.exports.Logout = async (req, res, next) => {
    req.logout((err) => {
        if(err){
            console.log("ERROR:" + err);
        }
    });
    res.send('/');
}





