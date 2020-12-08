const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
    default: "A",
  },
});

module.exports = mongoose.model("admin", AdminSchema);
