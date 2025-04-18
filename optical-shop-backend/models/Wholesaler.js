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

  // sirf ek baar unique id banegi fir data - ho  ya + wo unique id change nhi hogi
  if (!this.isNew) {
    console.log("Existing document, skipping uniqueID generation.");
    return next();
  }

  console.log("Generating uniqueID...");

  // sab filed hai ya nhi 
  if (!this.name || !this.framePrice || !this.frameType || !this.quantity || !this.frameBrand || !this.billNumber) {
    throw new Error("Missing fields for ID generation!");
  }

  const nameInitial = this.name.charAt(0).toUpperCase();
  const priceDigits = this.framePrice.toString().slice(0, 2); 
  const typeInitial = this.frameType.charAt(0).toUpperCase();
  const quantityDigit = this.quantity.toString().slice(-1); 
  const billFirstDigit = this.billNumber.toString().charAt(0); 

  const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();

  // Final Unique ID yha milegi wo bhi insub ko combine kiya hai enko combine kr ke unique id genrat hogi
  this.uniqueID = `${nameInitial}${priceDigits}${typeInitial}${quantityDigit}${billFirstDigit}${randomPart}`;

  console.log("Final uniqueID:", this.uniqueID);
  next();
});

module.exports = mongoose.model("Wholesaler", WholesalerSchema);
