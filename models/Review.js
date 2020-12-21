const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  userReview: {
    type: String,
  },
  stars: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("review", ReviewSchema);
