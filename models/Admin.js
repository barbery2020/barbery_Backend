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
    type: Buffer,
    default: null,
  },
});

module.exports = mongoose.model("admin", AdminSchema);
