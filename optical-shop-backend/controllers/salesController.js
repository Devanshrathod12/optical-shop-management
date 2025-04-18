const Sales = require("../models/Sales");

// Add Daily Sale Api
exports.addSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();
    res.status(201).json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Monthly Sales Api
exports.getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params; //  sale ID url se yha se milegi
    const updatedSale = await Sales.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedSale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }

    res.status(200).json({ success: true, sale: updatedSale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};