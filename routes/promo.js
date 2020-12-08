const express = require("express");
const router = express.Router();
const auth = require("../middleware/adminAuth");
const { check, validationResult } = require("express-validator");

const Promo = require("../models/Promo");

// @route   GET api/promo
// @desc    Get all promos
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const promos = await Promo.find().sort({
      date: -1,
    });
    res.json(promos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("promoCode", "Please add a valid promo").not().isEmpty(),
      check("discount", "Please add discount amount").not().isEmpty(),
      check("status", "Please set promo status").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { promoCode, discount, status } = req.body;
    console.log(promoCode);
    try {
      let checkIfPromo = await Promo.findOne({ promoCode });
      if (checkIfPromo) {
        return res.status(400).json({ msg: "Promo already exists" });
      }

      const newPromo = new Promo({
        promoCode,
        discount,
        status,
      });
      const promo = await newPromo.save();
      res.json(promo);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
