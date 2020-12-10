const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/barberAuth");
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

// @route   PUT api/specialist/:id
// @desc    Update specialist
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    firstName,
    lastName,
    shopTitle,
    address,
    openTiming,
    closeTiming,
    days,
    email,
    phoneNo,
    password,
    image,
    longitude,
    latitude,
  } = req.body;

  // Build specialist object
  const barberFields = {};
  if (firstName) barberFields.firstName = firstName;
  if (lastName) barberFields.lastName = lastName;
  if (shopTitle) barberFields.shopTitle = shopTitle;
  if (address) barberFields.address = address;
  if (openTiming) barberFields.openTiming = openTiming;
  if (closeTiming) barberFields.closeTiming = closeTiming;
  if (days) barberFields.days = days;
  if (email) barberFields.email = email;
  if (phoneNo) barberFields.phoneNo = phoneNo;
  if (password) barberFields.password = password;
  if (image) barberFields.image = image;
  if (longitude) barberFields.longitude = longitude;
  if (latitude) barberFields.latitude = latitude;

  try {
    let barber = await Barber.findById(req.params.id);

    if (!barber) return res.status(404).json({ msg: "Barber not found" });

    barber = await Barber.findByIdAndUpdate(
      req.params.id,
      { $set: barberFields },
      { new: true }
    );

    res.json(barber);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
