const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const router = express.Router()


//create a user using POST: /api/auth 
router.post(
  "/",
  [
    body("name", "name should be of minimum 8 characters").isLength({
      min: 3,
    }),
    body("password", "password should be of minimum 8 characters").isLength({
      min: 8,
    }),
    body("email", "enter a valid email").isEmail(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    })
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json({ error: "Database error: " + err.message }));
  }
);
module.exports=router