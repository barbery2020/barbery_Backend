const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Barber = require("../models/Barber");
const User = require("../models/User");
const Service = require("../models/Service");
const Specialist = require("../models/Specialist");
const Collection = require("../models/Collection");
const Review = require("../models/Review");
const Package = require("../models/Package");

// @route   POST api/users
// @desc    Register a user
// @access  Public

router.get("/averageRating/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const reviews = await Review.findById(barber);
    let averageRating = 0;
    let total = 0;
    for (let i = 0; i < reviews.length; i++) {
      total = total + reviews[i].stars;
    }
    averageRating = total / reviews.length;
    res.status(200).json([{ title: "Ratings", value: averageRating }]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/allSaloons", auth, async (req, res) => {
  try {
    const barber = await Barber.find(); //exclude password
    res.json(barber);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/barber/:id", async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).sort({
      date: -1,
    }); //exclude password
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

router.get("/saloonPackages/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const packages = await Package.findById(barber).sort({
      date: -1,
    });
    res.json(packages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/saloonCollections/:id", auth, async (req, res) => {
  try {
    const barber = req.params.id;
    const collections = await Collection.findById(barber).sort({
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
    const reviews = await Review.findById(barber).sort({
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
    const services = await Service.findById(barber).sort({
      date: -1,
    });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
