const express = require("express");
const router = express.Router();
const {customeradd,customerget,customerUpdate} = require("../controllers/customer")
router.post("/add",customeradd)
router.get("/get",customerget)
router.put("/update/:id",customerUpdate)
module.exports = router