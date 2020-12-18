const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Barber = require("../models/Barber");
const Appointment = require("../models/Appointment");
const Specialist = require("../models/Specialist");
const Services = require("../models/Service");
const Packages = require("../models/Package");
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
router.put("/", auth, async (req, res) => {
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
    let barber = await Barber.findById(req.barber.id);

    if (!barber) return res.status(404).json({ msg: "Barber not found" });

    barber = await Barber.findByIdAndUpdate(
      req.barber.id,
      { $set: barberFields },
      { new: true }
    );

    res.json(barber);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth
// @desc    Get logged in barber
// @access  Private
router.get("/records", auth, async (req, res) => {
  try {
    const records = await Appointment.find({
      barber: req.barber.id,
    });
    const specialist = await Specialist.find({
      barber: req.barber.id,
    });
    let services = await Services.find({
      barber: req.barber.id,
    });
    let packages = await Packages.find({
      barber: req.barber.id,
    });
    const totalCustomer = records.length;
    let totalSpecialist = specialist.length;
    let totalServices = services.length;
    let totalPackages = packages.length;
    let bill = 0;
    let appointmentCompleted = 0;
    let appointmentPending = 0;
    for (let i = 0; i < records.length; i++) {
      bill = bill + records[i].bill;
      appointmentPending =
        records[i].status === true
          ? appointmentPending + 1
          : appointmentPending + 0;
      appointmentCompleted =
        records[i].status === false
          ? appointmentCompleted + 1
          : appointmentCompleted + 0;
    }
    res.json({
      totalCustomer,
      totalSpecialist,
      appointmentCompleted,
      appointmentPending,
      totalServices,
      totalPackages,
      bill,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
