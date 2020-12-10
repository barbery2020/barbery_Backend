const express = require("express");
const router = express.Router();
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Specialist = require("../models/Specialist");

// @route   GET api/specialist
// @desc    Get a barbers all specialist
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const barber = req.barber.id;
    const specialist = await Specialist.find({ barber }).sort({
      date: -1,
    });
    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/specialist
// @desc    Add new specialist
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please add specialist name").not().isEmpty(),
      check("picture", "Please include a valid picture of specialist")
        .not()
        .isEmpty(),
      check("status", "Please set specialist status").not().isEmpty(),
      check("description", "Please enter your specialist description")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, picture, status, description } = req.body;

    try {
      let checkIfSpecialist = await Specialist.findOne({ name });
      if (checkIfSpecialist) {
        return res.status(400).json({ msg: "Specialist already exists" });
      }

      const newSpecialist = new Specialist({
        name,
        picture,
        status,
        description,
        barber: req.barber.id,
      });
      const specialist = await newSpecialist.save();
      res.json(specialist);
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
  const { name, cost, picture, status, description } = req.body;

  // Build specialist object
  const specialistFields = {};
  if (name) specialistFields.name = name;
  if (picture) specialistFields.picture = picture;
  if (status) specialistFields.status = status;
  if (description) specialistFields.description = description;

  try {
    let specialist = await Specialist.findById(req.params.id);

    if (!specialist)
      return res.status(404).json({ msg: "Specialist not found" });

    // Make sure barber owns specialist
    if (specialist.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    specialist = await Specialist.findByIdAndUpdate(
      req.params.id,
      { $set: specialistFields },
      { new: true }
    );

    res.json(specialist);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/specialist/:id
// @desc    Delete specialist
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let specialist = await Specialist.findById(req.params.id);

    if (!specialist)
      return res.status(404).json({ msg: "Specialist not found" });

    // Make sure user owns specialist
    if (specialist.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Specialist.findByIdAndRemove(req.params.id);

    res.json({ msg: "Specialist removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//post route Specialist
