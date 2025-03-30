const Wholesaler = require("../models/Wholesaler");

// Add Wholesaler
exports.addWholesaler = async (req, res) => {
  try {
    const wholesaler = new Wholesaler(req.body);
    await wholesaler.save();
    res.status(201).json({ success: true, wholesaler });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Wholesalers
exports.getWholesalers = async (req, res) => {
  try {
    const wholesalers = await Wholesaler.find();
    res.status(200).json({ success: true, wholesalers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

