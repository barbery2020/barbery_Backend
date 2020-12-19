const mongoose = require("mongoose");

const BarberSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  shopTitle: {
    type: String,
    default: "",
  },
  openTiming: {
    type: String,
    default: "00:00",
  },
  closeTiming: {
    type: String,
    default: "00:00",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: Object,
    default: {},
  },
  longitude: {
    type: String,
    default: "0",
  },
  latitude: {
    type: String,
    default: "0",
  },
});

module.exports = mongoose.model("barber", BarberSchema);
