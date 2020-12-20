const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

router.post(
  "/",
  [
    check("firstName", "Please add First name").not().isEmpty(),
    check("lastName", "Please add Last name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phoneNo", "Please follow place holder format").isMobilePhone(
      "en-PK"
    ),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phoneNo, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        firstName,
        lastName,
        email,
        phoneNo,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/", auth, async (req, res) => {
  const { firstName, lastName, email, phoneNo, image } = req.body;

  // Build specialist object
  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  if (phoneNo) userFields.phoneNo = phoneNo;
  if (image) {
    const buff = Buffer.from(image.data, "base64");
    userFields.image = { type: image.type, data: buff };
  }
  try {
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    );
    user.image = {
      ...user.image,
      data: user.image.data.toString("base64"),
    };

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
