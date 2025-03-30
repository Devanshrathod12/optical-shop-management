const express = require("express");
const router = express.Router();
const { addSale, getMonthlySales ,updateSale } = require("../controllers/salesController");

router.post("/add", addSale);
router.get("/monthly", getMonthlySales);
router.put("/update/:id", updateSale);

module.exports = router;