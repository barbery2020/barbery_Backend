const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
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
  category: {
    type: String,
    required: true,
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "barbers",
  },
});

module.exports = mongoose.model("service", ServiceSchema);
