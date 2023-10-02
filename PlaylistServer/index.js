require('dotenv').config();
require('./utils/oauth.js');
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Admin = require('./models/Admin');


const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: 'access-control-allow-origin,content-type',
}));

app.use(session({ 
    secret: process.env.SESSION_KEY, 
    resave: false, 
    saveUninitialized: true,
    cookie: {},
}));

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/admin', require('./routes/admin'));
app.use('/adminAuth', require('./routes/adminAuth'));


// app.get('/google',
//       passport.authenticate('google', { 
//       scope: ['profile']}) 
//     );

// app.get("/google/callback", 
//     passport.authenticate("google", {
//         failureRedirect: "/failure",
//         successRedirect: '/success',
//     }),
//     function(req, res){
//         res.redirect("/");
//     }    
// );
// app.post("/register", function(req, res){
//     const userName = req.body.email;
//     const password = req.body.password;
//     Admin.register({username: userName}, password, function(err, user) {
//         if(err){
//             console.log("ERROR:" + err);
//             res.redirect('/failure');
//         } else {
//             passport.authenticate("local")(req, res, function(){
//                 console.log(req.isAuthenticated());
//                 res.redirect('/success');
//             });
//         }
//     });
// });

// app.post("/login", function(req, res){
    
//     const admin = new Admin({
//         username: req.body.email,
//         password: req.body.password,
        
//     });

//     req.login(admin, function(err){
//         if(err){
//             console.log("ERROR:" + err);
//             res.redirect('/faliure');
//         } else {
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect('/success');
//             });
//         }
//     });

// });

// app.get("/logout", function(req, res){
//     req.logout((err) => {
//         if(err){
//             console.log("ERROR:" + err);
//         }
//     });
//     res.redirect('http://localhost:3000');
// });

// app.get('/', (req, res) => {

//     if(req.isAuthenticated()){
//         console.log("req is Authenticated.");
//          res.render("/success");
//     } else {
//         console.log("req is not authenticated.");
//         res.redirect("/failure");
//     }
// });

// app.get('/success', (req, res) => {
//     if(req.user) {
//         res.status(200).json({
//             success: true,
//             message: 'success',
//             admin: req.user,
//         });
//     }
// });

// app.get('/failure', (req, res) => {
//     res.status(401).json({
//         success: false,
//         message: "unauthorized",
//     })
// })


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