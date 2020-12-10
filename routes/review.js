const express = require("express");
const router = express.Router();
const auth = require("../middleware/barberAuth");
const UserAuth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Review = require("../models/Review");

// @route   GET api/review
// @desc    Get all review
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({
      date: -1,
    });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    UserAuth,
    [
      check("review", "review can't be empty").not().isEmpty(),
      check("stars", "Please stars to give review").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userReview, stars, appointmentId } = req.body;
    try {
      let checkIfReview = await Review.findOne({ appointmentId });
      if (checkIfReview) {
        return res.status(400).json({ msg: "Already reviewed" });
      }

      const newReview = new Review({
        userReview,
        stars,
        appointmentId,
        user: req.user.id,
      });
      const review = await newReview.save();
      res.json(review);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
