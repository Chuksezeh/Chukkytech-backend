require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const repairOrderRoutes = require("./routes/repairOrderRoutes");
const adminRepairOrderRoutes = require("./routes/adminRepairOrderRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/repair", repairOrderRoutes);
app.use("/adminRepair", adminRepairOrderRoutes);



// app._router.stack.forEach((r) => {
//     if (r.route && r.route.path) {
//       console.log(r.route.path);
//     }
//   });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

