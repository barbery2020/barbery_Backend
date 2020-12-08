const mongoose = require("mongoose");

const SpecialistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "barbers",
  },
});

module.exports = mongoose.model("specialist", SpecialistSchema);
