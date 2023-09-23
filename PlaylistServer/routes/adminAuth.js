const express = require('express');
const router = express.Router();
const { Signup, Login  } = require('../controllers/AuthController');
const { userVerification } = require('../middlewares//authMiddleware');
//const Admin = require('../models/Admin');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//require("dotenv").config();
//const requireAuth = require('../middlewares/requireAuth');

router.post('/sign-up', Signup);
router.post('/log-in', Login);
router.post('/', userVerification)

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
  
module.exports = router;