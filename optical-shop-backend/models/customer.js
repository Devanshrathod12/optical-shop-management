const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: Date, default: Date.now },  // Default current date
    billNo: { type: String },  // Optional
    totalAmount: { type: Number, default: 0 }  // Default 0
});

module.exports = mongoose.model("Customer", customerSchema);
