const mongoose = require("mongoose");

const CollectionSchema = {
  date: {
    type: Date,
    default: Date.now,
  },
  data: Buffer,
  type: {
    type: String,
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "barbers",
  },
};

module.exports = mongoose.model("collection", CollectionSchema);
