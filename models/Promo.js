const mongoose = require("mongoose");

const PromoSchema = mongoose.Schema({
  promoCode: {
    type: String,
  },
  discount: {
    type: String,
  },
  status: {
    type: Boolean,
  },
});

module.exports = mongoose.model("promo", PromoSchema);
