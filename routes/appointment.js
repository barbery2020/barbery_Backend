const express = require("express");
const router = express.Router();
const barberAuth = require("../middleware/barberAuth");
const UserAuth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const Package = require("../models/Package");

// @route   GET api/appointment
// @desc    Get a barbers all appointment
// @access  Private

router.get("/user", UserAuth, async (req, res) => {
  try {
    const user = req.user.id;
    let appointments = await Appointment.find({ user })
      .sort({
        date: -1,
      })
      .populate("specialist")
      .populate("services");
    // let services = [];

    // appointments = await Promise.all(
    //   await new Promise((resolve, reject) => {
    //     resolve(
    //       appointments.map(async (val) => {
    //         let services = await val.services.map(
    //           async (val) => await Service.findById(val)
    //         );
    //         return {
    //           _id: val._id,
    //           promo: val.promo,
    //           bill: val.bill,
    //           timing: val.timing,
    //           date: val.date,
    //           status: val.status,
    //           services,
    //           specialist: val.specialist,
    //           barber: val.barber,
    //         };
    //       })
    //     );
    //   })
    // );
    // appointments = await Promise.all(
    //   appointments.map(async (val) => {
    //     return new Promise(async (resolve, reject) => {
    //       const service = val.services;
    //       services = await Promise.all(
    //         service.map((val) => {
    //           return Service.findById(val.toString());
    //         })
    //       );
    //       console.log(services);
    //       resolve({
    //         _id: val._id,
    //         promo: val.promo,
    //         bill: val.bill,
    //         timing: val.timing,
    //         date: val.date,
    //         status: val.status,
    //         services,
    //         specialist: val.specialist,
    //         barber: val.barber,
    //       });
    //     });
    //   })
    // );
    // .populate(["service"]);
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/barber", barberAuth, async (req, res) => {
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
      check("services", "Please select services..").not().isEmpty(),
      check("specialist", "Please select specialist..").not().isEmpty(),
      check("barber", "Please select barber..").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bill,
      timing,
      date,
      category,
      services,
      specialist,
      barber,
    } = req.body;
    // console.log(barber);

    try {
      const newAppointment = new Appointment({
        bill,
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

router.put("/:id", barberAuth, async (req, res) => {
  const { status } = req.body;
  const appointmentFields = {};
  if (status !== undefined) appointmentFields.status = status;
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ msg: "Appointment not found" });

    // Make sure barber owns appointment
    if (appointment.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: appointmentFields },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//post route appointment
