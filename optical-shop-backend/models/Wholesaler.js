const mongoose = require("mongoose");

const WholesalerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  framePrice: { type: Number, required: true },
  frameType: { type: String, required: true },
  frameBrand: { type: String, required: true },
  quantity: { type: Number, required: true },
  billNumber: { type: String, required: true },
  uniqueID: { type: String, unique: true }
});

// Unique ID Generator Middleware - Run Only on New Document Creation
WholesalerSchema.pre("save", function (next) {
  console.log("Checking if uniqueID should be generated...");

  // सिर्फ़ नए डॉक्यूमेंट के लिए uniqueID बनाओ, अपडेट या डिलीट पर नहीं
  if (!this.isNew) {
    console.log("Existing document, skipping uniqueID generation.");
    return next();
  }

  console.log("Generating uniqueID...");

  // Ensure all required fields exist
  if (!this.name || !this.framePrice || !this.frameType || !this.quantity || !this.frameBrand || !this.billNumber) {
    throw new Error("Missing fields for ID generation!");
  }

  // Extracting necessary details
  const nameInitial = this.name.charAt(0).toUpperCase(); // First letter of Name
  const priceDigits = this.framePrice.toString().slice(0, 2); // First 2 digits of Price
  const typeInitial = this.frameType.charAt(0).toUpperCase(); // First letter of Frame Type
  const quantityDigit = this.quantity.toString().slice(-1); // Last digit of Quantity
  const billFirstDigit = this.billNumber.toString().charAt(0); // First digit of Bill Number

  // Generate a 2-character Random String
  const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();

  // Final Unique ID
  this.uniqueID = `${nameInitial}${priceDigits}${typeInitial}${quantityDigit}${billFirstDigit}${randomPart}`;

  console.log("Final uniqueID:", this.uniqueID);
  next();
});

module.exports = mongoose.model("Wholesaler", WholesalerSchema);
