const express = require("express");
const { signup, login } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup); // working fine 09/08/2025

router.post("/login", login); // working fine 09/08/2025

module.exports = router;