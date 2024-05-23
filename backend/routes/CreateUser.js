const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtkey =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate, porro";
router.post(
  "/createuser",
  [
    body("name", "Not a valid name").isLength({ min: 3 }),
    body("email", "Not a valid email").isEmail(),
    body("password", "Not a valid password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(11);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log("Error in creating user");
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email", "Not a valid email").isEmail(),
    body("password", "Not a valid password").exists(),
  ],
  async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(400)
          .json({ errors: "Try logging with correct credentials" });
      }

      const passcompare = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (!passcompare) {
        return res
          .status(400)
          .json({ errors: "Try logging with correct credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtkey);
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log("Error in creating user");
      res.json({ success: false });
    }
  }
);

module.exports = router;
