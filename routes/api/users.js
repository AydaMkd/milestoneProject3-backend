const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config()
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//register user
router.post(
  '/',
  check('username', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    //check if user exists
    try{
      let user = await User.findOne({email});
      if(user){
       return res.status(400).json({errors:[{msg:'User already exists'}]});
      }
      
      user = new User(
        {
          username,
          email,
          password,
      
        }
      )
       // encrypt password
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password, salt);
      await user.save();
      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload, 
               process.env.jwtSecret,
               {expiresIn: 240000},
               (err,token)=>{
                if (err) throw err;
                res.json({token});
               }
               );
      // res.send('User registered')
    }catch(err){
     console.error(err.message);
     res.status(500).send('Server error');
    } 
  }
);

module.exports = router;