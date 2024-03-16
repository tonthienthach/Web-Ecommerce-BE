const mongoose = require("mongoose");
const moment = require("moment-timezone");

const RateSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
    },
    content: {
      type: String,
      default: "User does not write any content",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rate", RateSchema);
