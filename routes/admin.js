const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/adminAuth");
const { check, validationResult } = require("express-validator");

const Admin = require("../models/Admin");
const Barber = require("../models/Barber");
const Appointment = require("../models/Appointment");
const Specialist = require("../models/Specialist");
const Services = require("../models/Service");
const Packages = require("../models/Package");
const Promos = require("../models/Promo");
const User = require("../models/User");

router.post(
  "/",
  [
    check("firstName", "Please add First name").not().isEmpty(),
    check("lastName", "Please add Last name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
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

    const { firstName, lastName, email, password } = req.body;

    try {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ msg: "Admin already exists" });
      }

      admin = new Admin({
        firstName,
        lastName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);
      await admin.save();

      const payload = {
        admin: {
          id: admin.id,
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

router.get("/records", async (req, res) => {
  try {
    const appointmentRecords = await Appointment.find();
    const totalClients = await (await User.find()).length;
    const totalBarbers = await (await Barber.find()).length;
    let totalRevenue = 0;
    const totalAppointments = appointmentRecords.length;
    let appointmentCompleted = 0;
    let appointmentPending = 0;
    for (let i = 0; i < totalAppointments; i++) {
      if (appointmentRecords[i].status !== false) {
        appointmentCompleted++;
      } else {
        totalRevenue += appointmentRecords[i].bill;
        appointmentPending++;
      }
      console.log(appointmentRecords[i].bill);
    }
    res.status(200).json([
      { title: "Total Clients", totalClients: totalClients },
      { title: "Total Barbers", totalBarbers: totalBarbers },
      {
        title: "Appointments Compeleted",
        appointmentCompleted: appointmentCompleted,
      },
      { title: "Appointments Pending", appointmentPending: appointmentPending },
      { title: "Total Appointments", totalAppointments: totalAppointments },
      { title: "Total Revenue", totalRevenue: totalRevenue },
    ]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/barber/:id", async (req, res) => {
  const { status } = req.body;
  const barberFields = {};
  if (status === true) barberFields.status = false;
  else barberFields.status = true;
  try {
    let barber = await Barber.findById(req.params.id);

    if (!barber) return res.status(404).json({ msg: "Barber not found" });

    // Make sure barber owns barber
    // if (barber.barber.toString() !== req.barber.id) {
    //   return res.status(401).json({ msg: "Not authorized" });
    // }

    barber = await Barber.findByIdAndUpdate(
      req.params.id,
      { $set: barberFields },
      { new: true }
    );
    //   .populate("specialist", "picture name")
    //   .populate("services", "name cost")
    //   .populate("review")
    //   .populate("user", "firstName lastName image");

    // pusher.trigger("notification", "appointmentStatus", {
    //   barber,
    // });

    res.json(barber);
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server Error");
    res.status(500).json({ msg: err.message });
  }
});

router.put("/user/:id", async (req, res) => {
  const { status } = req.body;
  const userFields = {};
  if (status === true) barberFields.status = false;
  else barberFields.status = true;
  try {
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Make sure user owns user
    // if (user._id.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: "Not authorized" });
    // }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );
    //   .populate("specialist", "picture name")
    //   .populate("services", "name cost")
    //   .populate("review")
    //   .populate("user", "firstName lastName image");

    // pusher.trigger("notification", "appointmentStatus", {
    //   user,
    // });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server Error");
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
