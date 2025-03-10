const db = require("../config/db");

const createRepairOrder = (orderData, callback) => {
    const {
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
        createdDateTime,
    } = orderData;

    db.query(
        "INSERT INTO repairorder (details, deviceModel, repairOrderType, deviceType, phone, pickUpAddress, reserveDate, status, userId, repairOrderId, repairOrderCode, createdDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
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
            createdDateTime,
        ],
        callback
    );
};

const getRepairOrdersByUser = (userId, callback) => {
    db.query(
        "SELECT * FROM repairorder WHERE userId = ? ORDER BY createdDateTime DESC",
        [userId],
        callback
    );
};

module.exports = { createRepairOrder, getRepairOrdersByUser };
