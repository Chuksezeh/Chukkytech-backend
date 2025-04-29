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
const updateUserStatus = require("./routes/authRoutes");
const deleteUser = require("./routes/authRoutes");
const getAllAdminUsers = require("./routes/authRoutes");

const updateAdminStatus = require("./routes/authRoutes");
const deleteAdminUser = require("./routes/authRoutes");
const registerLocation = require("./routes/locationRoutes");
const getAllLocations = require("./routes/locationRoutes")
const createUserComment = require("./routes/userCommentRoutes");
const getAllComments = require("./routes/userCommentRoutes");
const updateCommentStatus = require("./routes/userCommentRoutes");
const deleteComment = require("./routes/userCommentRoutes");
const updateLocation = require("./routes/locationRoutes");
const deleteLocation = require("./routes/locationRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/repair", repairOrderRoutes);
app.use("/adminRepair", adminRepairOrderRoutes);
app.use("/auth", registerAdminUser);
app.use("/auth", loginAdminUser);
app.use("/auth", getAllOrders);
app.use("/auth", updateUserStatus);
app.use("/auth", deleteUser);
app.use("/auth", getAllAdminUsers);
app.use("/auth", updateAdminStatus);
app.use("/auth", deleteAdminUser);
app.use("/location", registerLocation);
app.use("/location", getAllLocations);
app.use("/comment", createUserComment);
app.use("/comment", getAllComments);
app.use("/comment", updateCommentStatus);
app.use("/comment", deleteComment);
app.use("/location", updateLocation);
app.use("/location", deleteLocation);





// app._router.stack.forEach((r) => {
//     if (r.route && r.route.path) {
//       console.log(r.route.path);
//     }
//   });
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

