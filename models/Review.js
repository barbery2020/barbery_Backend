const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  userReview: {
    type: String,
  },
  stars: {
    type: String,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("review", ReviewSchema);
