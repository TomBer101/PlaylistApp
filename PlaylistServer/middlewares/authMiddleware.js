const Admin = require('../models/Admin');
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const admin = await Admin.findById(data.id)
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