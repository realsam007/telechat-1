const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      default: "Global",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
    },
    room: {
      type: String,
      default: "global",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Message", messageSchema);
