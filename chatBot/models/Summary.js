const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  summaryJSON: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Summary || mongoose.model("Summary", summarySchema);
