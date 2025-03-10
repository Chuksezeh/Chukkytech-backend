const express = require("express");
const router = express.Router();
const repairOrderController = require("../controllers/repairOrderController");

router.post("/repairorder", repairOrderController.createRepairOrder);
router.get("/getRepairOrderCode/:repairOrderCode", repairOrderController.getRepairOrderByCode);
router.get("/getUserRepairOrders/:userId",repairOrderController.getRepairOrdersByUser)

module.exports = router;
