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
    default: "10:00 AM",
  },
  closeTiming: {
    type: String,
    default: "11:00 PM",
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
    default: "",
  },
  latitude: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("barber", BarberSchema);
