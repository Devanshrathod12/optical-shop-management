const customer = require("../models/customer")

exports.customeradd = async (req,res) => {
    try {
        const customerData = new customer(req.body)
        await customerData.save()
        res.status(201).json({success:true, customerData})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}
exports.customerget = async (req, res) => {
    try {
      const customers = await customer.find(); // ✅ Corrected model usage
      res.status(200).json({ success: true, customers }); // ✅ Send correct response format
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };