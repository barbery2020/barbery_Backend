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

router.get("/records", auth, async (req, res) => {
  try {
    const appointmentRecords = await Appointment.find();
    console.log(await appointmentRecords.find());
    const totalClients = await User.find();
    const totalBarbers = await Barber.find();
    let totalRevenue = 0;
    const totalAppointments = appointmentRecords.length;
    let appointmentCompleted = 0;
    let appointmentPending = 0;
    for (let i = 0; i < totalAppointments; i++) {
      if (!appointmentRecords[i].status === false) {
        appointmentCompleted++;
      } else {
        appointmentPending++;
      }
      totalRevenue += appointmentRecords[i].bill;
    }
    res.status(200).json([
      { title: "Total Clients", value: totalClients },
      { title: "Total Barbers", value: totalBarbers },
      { title: "Appointments Compeleted", value: appointmentCompleted },
      { title: "Appointments Pending", value: appointmentPending },
      { title: "Total Appointments", value: totalAppointments },
      { title: "Total Revenue", value: bill },
    ]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
