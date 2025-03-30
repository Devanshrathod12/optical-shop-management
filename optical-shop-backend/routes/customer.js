const express = require("express");
const router = express.Router();
const {customeradd,customerget} = require("../controllers/customer")
router.post("/add",customeradd)
router.get("/get",customerget)
module.exports = router