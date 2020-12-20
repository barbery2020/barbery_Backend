const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Barber = require("../models/Barber");
const Service = require("../models/Service");
const Specialist = require("../models/Specialist");
const Collection = require("../models/Collection");
const Review = require("../models/Review");

// @route   POST api/users
// @desc    Register a user
// @access  Public

router.get("/allSaloons", auth, async (req, res) => {
  try {
    const barber = await Barber.find(); //exclude password
    res.json(barber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/saloonSpecialist/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const specialist = await Specialist.find({ barber }).sort({
      date: -1,
    });
    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/saloonCollection/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const collections = await Collection.find({ barber }).sort({
      date: -1,
    });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/saloonReviews/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const reviews = await Review.find({ barber }).sort({
      date: -1,
    });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/saloonServices/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const services = await Service.find({ barber }).sort({
      date: -1,
    });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
