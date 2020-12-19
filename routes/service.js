const express = require("express");
const router = express.Router();
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Service = require("../models/Service");

// @route   GET api/service
// @desc    Get a barbers all services
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const barber = req.barber.id;
    const services = await Service.find({ barber }).sort({
      date: -1,
    });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/services
// @desc    Add new service
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please add service name").not().isEmpty(),
      check("cost", "Please add service cost").not().isEmpty(),
      check("picture", "Please include a valid picture of service")
        .not()
        .isEmpty(),
      check("status", "Please set service status").not().isEmpty(),
      check("description", "Please enter your service description")
        .not()
        .isEmpty(),
      check("category", "Please select service category").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, cost, picture, status, description, category } = req.body;

    try {
      let checkIfService = await Service.findOne({ name });
      if (checkIfService) {
        return res.status(400).json({ msg: "Service already exists" });
      }

      const newService = new Service({
        name,
        cost,
        picture,
        status,
        description,
        category,
        barber: req.barber.id,
      });
      const buff = Buffer.from(picture.data, "base64");
      newService.picture = { type: picture.type, data: buff };
      let service = await newService.save();
      newService.picture = {
        ...service.picture,
        data: service.picture.data.toString("base64"),
      };
      res.json(service);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/service/:id
// @desc    Update service
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, cost, picture, status, description, category } = req.body;
  console.log(status);
  // Build service object
  const serviceFields = {};
  if (name) serviceFields.name = name;
  if (cost) serviceFields.cost = cost;
  if (picture) {
    const buff = Buffer.from(picture.data, "base64");
    serviceFields.picture = { type: picture.type, data: buff };
  }
  if (status !== undefined) serviceFields.status = status;
  if (description) serviceFields.description = description;
  if (category) serviceFields.category = category;

  try {
    let service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ msg: "Service not found" });

    // Make sure barber owns service
    if (service.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: serviceFields },
      { new: true }
    );
    serviceFields.picture = {
      ...service.picture,
      data: service.picture.data.toString("base64"),
    };
    res.json(service);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/service/:id
// @desc    Delete service
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ msg: "Service not found" });

    // Make sure user owns service
    if (service.barber.toString() !== req.barber.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Service.findByIdAndRemove(req.params.id);

    res.json({ msg: "Service removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//post route service
