const passport = require('passport');
const Admin = require('../models/Admin');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(Admin.createStrategy());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_Id,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3030/adminAuth/google/callback',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
},
(accessToken, refreshToken, profile, done) => {
  console.log(profile);
    Admin.findOrCreate({googleId: profile.id}, (err, admin) => {
    return done(err, admin);
    });
  }
));


passport.serializeUser((admin, done) => {
  done(null, admin);
});

passport.deserializeUser((admin, done) => {
  done(null, admin);
});



module.exports = passport;
