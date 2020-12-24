const mongoose = require("mongoose");

const SpecialistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: Object,
    default: {},
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
  slots: {
    type: Array,
    default: [
      {
        date: Date.now(),
        slots: {
          time: "11:00AM",
          status: true,
          time: "12:00PM",
          status: true,
          time: "1:00PM",
          status: true,
          time: "2:00PM",
          status: true,
          time: "3:00PM",
          status: true,
          time: "4:00PM",
          status: true,
          time: "5:00PM",
          status: true,
          time: "6:00PM",
          status: true,
          time: "7:00PM",
          status: true,
          time: "8:00PM",
          status: true,
          time: "9:00PM",
          status: true,
          time: "10:00PM",
          status: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("specialist", SpecialistSchema);
