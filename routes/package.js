const express = require("express");
const router = express.Router();
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Package = require("../models/Package");

// @route   GET api/package
// @desc    Get a barbers all package
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const barber = req.barber.id;
    const packages = await Service.find({ barber }).sort({
      date: -1,
    });
    res.json(packages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/packages
// @desc    Add new package
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please add package name").not().isEmpty(),
      check("cost", "Please add package cost").not().isEmpty(),
      check("picture", "Please include a valid picture of package")
        .not()
        .isEmpty(),
      check("status", "Please set package status").not().isEmpty(),
      check("description", "Please enter your package description")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, cost, picture, status, description } = req.body;

    try {
      let checkIfPackage = await Package.findOne({ name });
      if (checkIfPackage) {
        return res.status(400).json({ msg: "Package already exists" });
      }

      const newPackage = new Package({
        name,
        cost,
        picture,
        status,
        description,
        barber: req.barber.id,
      });
      const buff = Buffer.from(picture.data, "base64");
      newPackage.picture = { type: picture.type, data: buff };
      let package = await newPackage.save();
      newPackage.picture = {
        ...package.picture,
        data: package.picture.data.toString("base64"),
      };
      res.json(package);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/package/:id
// @desc    Update package
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, cost, picture, status, description } = req.body;

  // Build package object
  const packageFields = {};
  if (name) packageFields.name = name;
  if (cost) packageFields.cost = cost;
  if (picture) {
    const buff = Buffer.from(picture.data, "base64");
    packageFields.picture = { type: picture.type, data: buff };
  }
  if (status) packageFields.status = status;
  if (description) packageFields.description = description;

  try {
    let package = await Package.findById(req.params.id);

    if (!package) return res.status(404).json({ msg: "Service not found" });

    // Make sure barber owns package
    if (package.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    package = await Package.findByIdAndUpdate(
      req.params.id,
      { $set: packageFields },
      { new: true }
    );
    packageFields.picture = {
      ...package.picture,
      data: package.picture.data.toString("base64"),
    };
    res.json(package);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/package/:id
// @desc    Delete package
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) return res.status(404).json({ msg: "Service not found" });

    // Make sure user owns package
    if (package.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Package.findByIdAndRemove(req.params.id);

    res.json({ msg: "Package removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//post route service
