const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/barberAuth");
const { check, validationResult } = require("express-validator");

const Service = require("../models/Service");

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
      const service = await Service.findOne({ name });
      if (service) {
        return res.status(400).json({ msg: "Service already exists" });
      }

      service = new Service({
        name,
        cost,
        picture,
        status,
        description,
        category,
        barber: req.barber.id,
      });
      const service = await service.save();
      res.json(service);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//post route service
