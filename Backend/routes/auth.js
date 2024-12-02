const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const router = express.Router()


//for password hashing
const bcrypt = require("bcryptjs");

//for jsonwebtoken "this is used to create tokens"
const jwt = require('jsonwebtoken')
const JWT_SECRET='HiThere@HowAreYou'


//create a user using POST: /api/auth/createUser 
router.post(
  "/createUser",
  [
    body("name", "name should be of minimum 8 characters").isLength({
      min: 3,
    }),
    body("password", "password should be of minimum 8 characters").isLength({
      min: 8,
    }),
    body("email", "enter a valid email").isEmail(),
  ],
  async(req, res) => {

    try {
      //check if any error exists and send bad request
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      //check if the user with same email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email exists" });
      }
      const salt = await bcrypt.genSalt(10)
      var secPass = await bcrypt.hash(req.body.password,salt)

      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //st using jwt
      const data={
        user:{
          id:user.id
        }
      }

      authToken=jwt.sign(data,JWT_SECRET)

      res.json({authToken});
      //jwt use end

    } catch (error) {
      console.error(error.message)
      res.status(500).send("some error occur")
    }
  }
  
);
module.exports=router