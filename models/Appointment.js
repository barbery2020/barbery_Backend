const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema({
  promo: {
    type: String,
    default: "",
  },
  timing: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "specialist",
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "barber",
  },
  services: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "service",
  },
});

module.exports = mongoose.model("appointment", AppointmentSchema);
