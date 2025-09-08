const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["user", "assistant", "summary"], // include summary
      required: true 
    },
    content: { type: String, required: true },
    flagged: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
