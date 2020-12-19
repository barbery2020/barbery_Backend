const express = require("express");
const router = express.Router();
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Collection = require("../models/Collection");

// @route   GET api/collection
// @desc    Get a barbers all collections
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const barber = req.barber.id;
    const collections = await Collection.find({ barber }).sort({
      date: -1,
    });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/collections
// @desc    Add new collection
// @access  Private
router.post(
  "/",
  [auth, [check("data", "Image can't be empty").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data, type } = req.body;

    try {
      const buff = Buffer.from(data, "base64");
      const newCollection = new Collection({
        data: buff,
        type,
        barber: req.barber.id,
      });
      let collection = await newCollection.save();
      collection = {
        _id: collection._id,
        type: collection.type,
        barber: collection.barber,
        date: collection.date,
        data: collection.data.toString("base64"),
      };
      res.json(collection);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/collection/:id
// @desc    Delete collection
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.id);

    if (!collection)
      return res.status(404).json({ msg: "Collection not found" });

    // Make sure user owns collection
    if (collection.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Collection.findByIdAndRemove(req.params.id);

    res.json({ msg: "Collection removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//post route collection
