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

// Unique ID Generator Middleware (FINAL FIX)
WholesalerSchema.pre("save", function (next) {
  console.log("Generating uniqueID..."); // Debug log

  // Ensure all required fields exist
  if (!this.name || !this.framePrice || !this.frameType || !this.quantity || !this.frameBrand || !this.billNumber) {
    throw new Error("Missing fields for ID generation!");
  }

  const nameInitial = this.name.charAt(0).toUpperCase(); // D
  const priceDigits = this.framePrice.toString().slice(0, 2); // 24
  const typeInitial = this.frameType.charAt(0).toUpperCase(); // S
  const quantityDigit = this.quantity.toString(); // 5
  const brandInitial = this.frameBrand.split(" ")[0].charAt(0).toUpperCase(); // W
  const billDigits = this.billNumber.toString().slice(-2); // 25

  this.uniqueID = `${nameInitial}${priceDigits}${typeInitial}${quantityDigit}${brandInitial}${billDigits}`;
  console.log("Final uniqueID:", this.uniqueID); // Debug log
  next();
});

module.exports = mongoose.model("Wholesaler", WholesalerSchema);