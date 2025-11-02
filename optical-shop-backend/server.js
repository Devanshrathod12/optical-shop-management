require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SMS = require('./routes/SMS');
const salesroutes = require("./routes/sales")
const Wholesaler = require("./routes/wholesalerRoutes")
const userRoutes = require("./routes/userRoutes")
const customer = require("./routes/customer")
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
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
app.use("/api/Users",userRoutes)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



//esme backup hai manualy
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const SMS = require('./routes/SMS');
// const salesroutes = require("./routes/sales");
// const Wholesaler = require("./routes/wholesalerRoutes");
// const userRoutes = require("./routes/userRoutes");
// const customer = require("./routes/customer")
// const bodyParser = require('body-parser');
// const { 
//   initializeBackupSystem,
//   handleManualBackup,
//   handleExportDatabase,
//   handleListBackups,
//   handleGetStatistics,
//   handleRestoreBackup
// } = require('./Backups/backupService');

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "*", credentials: true }));
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// mongoose.connect(MONGO_URI)
//   .then(async () => {
//     console.log("✅ MongoDB Connected Successfully!");
//     await initializeBackupSystem();
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// app.use("/api/sales", salesroutes);
// app.use("/api/Who", Wholesaler);
// app.use("/api/custo", customer);
// app.use("/api/sms", SMS);
// app.use("/api/Users", userRoutes);

// app.post('/api/backup/manual', handleManualBackup);
// app.get('/api/backup/export', handleExportDatabase);
// app.get('/api/backup/list', handleListBackups);
// app.get('/api/backup/stats', handleGetStatistics);
// app.post('/api/backup/restore', handleRestoreBackup);

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// // ```

// // ### 3️⃣ **Verify Your Folder Structure:**
// // ```
// // your-project/
// // ├── backup/
// // │   └── backup.js          ✅ (tumhara file with my code)
// // ├── models/
// // │   ├── Customer.js
// // │   ├── Sales.js
// // │   └── Wholesaler.js
// // ├── routes/
// // │   ├── customer.js
// // │   ├── sales.js
// // │   └── ...
// // ├── server.js              ✅ (updated)
// // ├── package.json
// // └── .env