const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");

router.get("/getAllRepairOrder", adminOrderController.getAllOrders);

module.exports = router;