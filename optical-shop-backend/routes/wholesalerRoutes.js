const express = require("express");
const router = express.Router();
const { addWholesaler, getWholesalers } = require("../controllers/wholesalerController");

router.post("/add", addWholesaler);
router.get("/all", getWholesalers);

module.exports = router;
