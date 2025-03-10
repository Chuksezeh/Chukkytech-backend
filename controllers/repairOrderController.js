const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const db = require("../config/db");

// Create Repair Order
exports.createRepairOrder = async (req, res) => {
    let {
        details,
        deviceModel,
        repairOrderType,
        deviceType,
        phone,
        pickUpAddress,
        reserveDate,
        status,
        userId,
        repairOrderId,
        repairOrderCode,
        createdDateTime
    } = req.body;

    if (!repairOrderId) repairOrderId = uuidv4().replace(/-/g, "").substring(0, 15);
    if (!repairOrderCode) repairOrderCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    if (!createdDateTime) createdDateTime = new Date();

    db.query(
        "INSERT INTO repairorder (details, deviceModel, repairOrderType, deviceType, phone, pickUpAddress, reserveDate, status, userId, repairOrderId, repairOrderCode, createdDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [details, deviceModel, repairOrderType, deviceType, phone, pickUpAddress, reserveDate, status, userId, repairOrderId, repairOrderCode, createdDateTime],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.status(201).json({
                message: "Repair order successfully booked",
                repairOrder: { repairOrderId, repairOrderCode, details, deviceModel, repairOrderType, deviceType, phone, pickUpAddress, reserveDate, status, userId, createdDateTime }
            });
        }
    );
};

// Get Repair Order by Code
exports.getRepairOrderByCode = (req, res) => {
    const { repairOrderCode } = req.params;
    db.query("SELECT * FROM repairorder WHERE BINARY repairOrderCode = ?", [repairOrderCode.trim()], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "Repair order not found" });

        res.status(200).json({ repairOrders: results });
    });
};


exports.getRepairOrdersByUser = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.query(
        "SELECT * FROM repairorder WHERE userId = ? ORDER BY createdDateTime DESC",
        [userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No repair orders found for this user" });
            }

            res.status(200).json({ repairOrders: results });
        }
    );
};



