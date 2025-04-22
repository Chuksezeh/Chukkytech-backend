require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const repairOrderRoutes = require("./routes/repairOrderRoutes");
const adminRepairOrderRoutes = require("./routes/adminRepairOrderRoutes");
const registerAdminUser = require("./routes/authRoutes")
const loginAdminUser = require("./routes/authRoutes");
const getAllOrders = require("./routes/authRoutes")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/repair", repairOrderRoutes);
app.use("/adminRepair", adminRepairOrderRoutes);
app.use("/auth", registerAdminUser);
app.use("/auth", loginAdminUser);
app.use("/auth", getAllOrders);




// app._router.stack.forEach((r) => {
//     if (r.route && r.route.path) {
//       console.log(r.route.path);
//     }
//   });
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

