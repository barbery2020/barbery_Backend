const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const Barber = require("../models/Barber");

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
      let barber = await Barber.findOne({ email });
      if (barber) {
        return res.status(400).json({ msg: "Barber already exists" });
      }

      barber = new Barber({
        firstName,
        lastName,
        email,
        phoneNo,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      barber.password = await bcrypt.hash(password, salt);
      await barber.save();

      const payload = {
        barber: {
          id: barber.id,
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

module.exports = router;
