require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SMS = require('./routes/SMS');
const salesroutes = require("./routes/sales")
const Wholesaler = require("./routes/wholesalerRoutes")
const customer = require("./routes/customer")
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true })); // ✅ CORS ENABLED
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/sales", salesroutes)
app.use("/api/Who",Wholesaler)
app.use("/api/custo",customer)
app.use("/api/sms", SMS)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
