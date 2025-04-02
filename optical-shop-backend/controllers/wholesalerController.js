const Wholesaler = require("../models/Wholesaler");

exports.addWholesaler = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    const wholesaler = new Wholesaler(req.body);
    await wholesaler.save();
    res.status(201).json({ success: true, wholesaler });
  } catch (error) {
    console.error("Error in addWholesaler:", error.message); // Debug log
    res.status(500).json({ 
      success: false, 
      message: error.message.includes("duplicate key") 
        ? "Bill number or other fields conflict. Change data and retry." 
        : error.message 
    });
  }
};

exports.getWholesalers = async (req, res) => {
  try {
    const wholesalers = await Wholesaler.find();
    res.status(200).json({ success: true, wholesalers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};