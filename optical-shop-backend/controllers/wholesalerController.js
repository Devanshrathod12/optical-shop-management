const Wholesaler = require("../models/Wholesaler");

exports.addWholesaler = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    const wholesaler = new Wholesaler(req.body);
    await wholesaler.save();
    res.status(201).json({ success: true, wholesaler });
  } catch (error) {
    console.error("Error in addWholesaler:", error.message);
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

// New API: Update quantity based on uniqueID
exports.updateQuantity = async (req, res) => {
  try {
    const { uniqueID } = req.params;

    const wholesaler = await Wholesaler.findOne({ uniqueID });

    if (!wholesaler) {
      return res.status(404).json({ success: false, message: "Wholesaler not found" });
    }

    if (wholesaler.quantity <= 0) {
      return res.status(400).json({ success: false, message: "Stock is already zero" });
    }

    wholesaler.quantity -= 1;
    await wholesaler.save();

    res.status(200).json({ success: true, message: "Quantity updated", wholesaler });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
