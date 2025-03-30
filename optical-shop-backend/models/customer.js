const mongoose = require("mongoose");
const customer = new mongoose.Schema({
    name:{type:String , required : true},
    contactNo:{type:String , required : true},
    address:{type:String , required : true}
})

module.exports = mongoose.model("customer",customer)