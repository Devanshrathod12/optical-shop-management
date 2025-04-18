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
      const customers = await customer.find(); //  Corrected model usage
      res.status(200).json({ success: true, customers }); //  Send response
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.customerUpdate = async (req, res) => {
    try {
        const { id } = req.params; //  URL se customer ID lo
        const updateData = req.body; //  Jo bhi naye data aayenge wo yahan honge

        //  Customer data update karo
        const updatedCustomer = await customer.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};