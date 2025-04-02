const express = require("express");
const router = express.Router();
const { addWholesaler, getWholesalers, updateQuantity } = require("../controllers/wholesalerController");

router.post("/add", addWholesaler);
router.get("/all", getWholesalers);
router.patch("/update-quantity/:uniqueID", updateQuantity);

module.exports = router;