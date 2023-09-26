const Admin = require('../models/Admin');
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  console.log('In user verification.');

  console.log('Request: ', req.cookies);
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  console.log('Token is: ', token);

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      console.log('Data is: ', data);
      const admin = await Admin.findById(data.id)
      console.log('Admin is: ', admin);
      
      if (admin) {
        return res.json({ 
            status: true, 
            admin: admin.email,
            playlistId: admin.playlist,
         });
      } 
      else return res.json({ status: false })
    }
  })
}