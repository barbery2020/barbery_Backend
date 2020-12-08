const express = require("express");
const router = express.Router();
const barberAuth = require("../middleware/barberAuth");
const UserAuth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Appointment = require("../models/Appointment");

// @route   GET api/appointment
// @desc    Get a barbers all appointment
// @access  Private
router.get("/", barberAuth, async (req, res) => {
  try {
    const barber = req.barber.id;
    const appointments = await Appointment.find({ barber }).sort({
      date: -1,
    });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/appointment
// @desc    User add a new appointment to barber
// @access  Private
router.post(
  "/",
  [
    UserAuth,
    [
      check("timing", "Please select your appointment timing").not().isEmpty(),
      check("date", "Please pick a valid date for your appointment")
        .not()
        .isEmpty(),
      check("category", "Please select service category").not().isEmpty(),
      check("services", "Please select services..").not().isEmpty(),
      check("specialist", "Please select specialist..").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { timing, date, category, services, specialist, barber } = req.body;
    console.log(barber);

    try {
      const newAppointment = new Appointment({
        timing,
        date,
        category,
        services, //array
        specialist,
        barber,
        user: req.user.id,
      });
      const appointment = await newAppointment.save();
      res.json(appointment);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

//post route service
