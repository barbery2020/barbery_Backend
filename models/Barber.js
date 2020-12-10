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
  },
  openTiming: {
    type: String,
    default: "10am",
  },
  closeTiming: {
    type: String,
    default: "10pm",
  },
  days: {
    type: Array,
    default: [],
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
    default: "address",
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
    type: String,
    default: "image",
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
