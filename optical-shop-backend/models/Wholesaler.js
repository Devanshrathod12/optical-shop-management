const mongoose = require("mongoose");

const WholesalerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  framePrice: { type: Number, required: true },
  frameType: { type: String, required: true },
  frameBrand: { type: String, required: true },
  quantity: { type: Number, required: true },
  billNumber: { type: String, required: true },
  uniqueID: { type: String, unique: true }
});
// Unique ID Generator Middleware
WholesalerSchema.pre("save", function (next) {
  const nameInitial = this.name.charAt(0).toUpperCase();
  const typeInitial = this.frameType.charAt(0).toUpperCase();
  const priceDigits = this.framePrice.toString().slice(0, 2);
  this.uniqueID = `${nameInitial}${typeInitial}${priceDigits}`;
  next();
});

module.exports = mongoose.model("Wholesaler", WholesalerSchema);
