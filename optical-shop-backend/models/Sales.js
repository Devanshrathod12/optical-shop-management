const mongoose = require("mongoose");
const salesSchema = new mongoose.Schema({
  billNo: String,
  date: Date,
  customerName: String,
  age: Number,
  address: String,
  contactNo: String,
  lensType: String, // single, bifocal, progressive, contact lens
  frameName: String,
  glasses: String,
  total: Number,
  advance: Number,
  balance: Number,
  framePurchasingPrice: Number,
  LensPurchasingPrice: Number,
  Fiting: Number,
  boxcloth:Number
});
module.exports = mongoose.model("Sales", salesSchema);