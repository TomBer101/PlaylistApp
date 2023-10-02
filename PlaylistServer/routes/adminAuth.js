const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Signup, Login, GoogleAuth, GoogleCallback} = require('../controllers/AuthController');
const { userVerification } = require('../middlewares/authMiddleware');
const CLIENT_URL = 'http://localhost:3000/'


router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        //   cookies: req.cookies
      });
    }
});

router.post("/register", function(req, res){
    const userName = req.body.email;
    const password = req.body.password;
    Admin.register({username: userName}, password, function(err, user) {
        if(err){
            console.log("ERROR:" + err);
            res.redirect('/login/failed');
        } else {
            passport.authenticate("local")(req, res, function(){
                console.log(req.isAuthenticated());
                res.redirect('/login/failed');
            });
        }
    });
});

router.post("/login", function(req, res){
    
    const admin = new Admin({
        username: req.body.email,
        password: req.body.password,
        
    });

    req.login(admin, function(err){
        if(err){
            console.log("ERROR:" + err);
            res.redirect('/login/failed');
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect('/login/failed');
            });
        }
    });

});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    })
);

module.exports = router;



//const Admin = require('../models/Admin');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//require("dotenv").config();
//const requireAuth = require('../middlewares/requireAuth');



// router.get('/google', passport.authenticate('google', {scope: ['profile']}));
// router.get('/auth/google/callaback', passport.authenticate('google'), (req, res) => {
//     res.status(201).json({ message: 'Admin loggedd in successfully', success: true});
// });
// router.get('/auth/google', GoogleAuth);
// router.get('/google/callback', GoogleCallback);
// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//     res.redirect('/api/admin');
// });



// router.post('/sign-up', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const adminExists = await Admin.findOne({ email });
//         if (adminExists) {
//             res.status(401).json({ message: 'Email is already in use.'});
//             return;
//         }

//         const saltRounds = 10;
//         bcrypt.hash(password, saltRounds, (err, hash) => {
//             if (err) {
//                 console.log(err);
//                 throw new Error('Internal Server Error');
//             }

//             const admin = new Admin({
//                 email : email ,
//                 password: hash,
//             });

//             admin.save().then(() => {
//                 return res.json({ message: 'User created successfully', admin});
//             });
//         });
//     } catch (err) {
//         res.status(401).send(err.message);
//     }
// });

// router.post('/sign-in', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const JWT_SECRET = process.env.JWT_SECRET;

//         const admin = await Admin.findOne({ email });
//         if (!admin) {
//             return res.status(401).json({ message: 'Invalid email credentials'});
//         }

//         bcrypt.compare(password, admin.password, (err, res) => {
//             if (res) {
//                 const token = jwt.sign({ email }, JWT_SECRET);
//                 return res.status(200).json({ message: 'Admin logged in successfully', token});
//             }

//             console.log(err);
//             return res.status(401).json({ message: 'Invalid credentials'});
//         });
//     } catch (err) {
//         res.status(401).send(err.message);
//     }
// });

// router.get("/test", requireAuth, (req, res) => {
//     res.send(`User: ${req.admin.email} is authorized to make this request`);
// });
  