const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");


exports.registerLocation = async (req, res) => {
    const { locationName, locationAddress, phone, shopName, longitude, latitude, status } = req.body;
    const locationId = uuidv4().replace(/-/g, "").substring(0, 15);
    const createdDateTime = new Date();

    const sql = `
      INSERT INTO locations_centers
        (locationId, locationName, locationAddress, phone, shopName, longitude, latitude, status, createdDateTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [locationId, locationName, locationAddress, phone, shopName, longitude, latitude, status, createdDateTime];

    console.log("RegisterLocation SQL:", sql);
    console.log("Params:", params);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Location INSERT ERROR:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(201).json({ message: "Location registered successfully" });
    });
};


exports.getAllLocations = (req, res) => {
    db.query("SELECT * FROM locations_centers ORDER BY createdDateTime DESC", (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(results);
    });
};

