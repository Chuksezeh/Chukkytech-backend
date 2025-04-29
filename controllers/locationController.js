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


exports.updateLocation = async (req, res) => {
    const { locationId } = req.params; // Get ID from URL params
    const updates = req.body; // Get all possible fields that might be updated

    // First, fetch the current location data
    const getSql = `SELECT * FROM locations_centers WHERE locationId = ?`;
    
    db.query(getSql, [locationId], (err, results) => {
        if (err) {
            console.error("Location FETCH ERROR:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        const currentLocation = results[0];
        
        // Prepare the update fields and values
        const updateFields = [];
        const updateValues = [];
        
        // Check each possible field and add to update if it's in the request
        if (updates.locationName !== undefined && updates.locationName !== currentLocation.locationName) {
            updateFields.push("locationName = ?");
            updateValues.push(updates.locationName);
        }
        
        if (updates.locationAddress !== undefined && updates.locationAddress !== currentLocation.locationAddress) {
            updateFields.push("locationAddress = ?");
            updateValues.push(updates.locationAddress);
        }
        
        if (updates.phone !== undefined && updates.phone !== currentLocation.phone) {
            updateFields.push("phone = ?");
            updateValues.push(updates.phone);
        }
        
        if (updates.shopName !== undefined && updates.shopName !== currentLocation.shopName) {
            updateFields.push("shopName = ?");
            updateValues.push(updates.shopName);
        }
        
        if (updates.longitude !== undefined && updates.longitude !== currentLocation.longitude) {
            updateFields.push("longitude = ?");
            updateValues.push(updates.longitude);
        }
        
        if (updates.latitude !== undefined && updates.latitude !== currentLocation.latitude) {
            updateFields.push("latitude = ?");
            updateValues.push(updates.latitude);
        }
        
        if (updates.status !== undefined && updates.status !== currentLocation.status) {
            updateFields.push("status = ?");
            updateValues.push(updates.status);
        }

        // If no fields to update, return early
        if (updateFields.length === 0) {
            return res.status(200).json({ message: "No changes detected", location: currentLocation });
        }

        // Add the locationId for the WHERE clause
        updateValues.push(locationId);

        // Build the SQL query
        const updateSql = `
            UPDATE locations_centers 
            SET ${updateFields.join(", ")} 
            WHERE locationId = ?
        `;

        console.log("UpdateLocation SQL:", updateSql);
        console.log("Params:", updateValues);

        // Execute the update
        db.query(updateSql, updateValues, (err, result) => {
            if (err) {
                console.error("Location UPDATE ERROR:", err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Location not found or not updated" });
            }
            
            res.status(200).json({ 
                message: "Location updated successfully",
                updatedFields: updateFields.map(field => field.split(' = ')[0])
            });
        });
    });
};


exports.deleteLocation = (req, res) => {
    const { locationId } = req.params;
    console.log('Received update request:', req.body);
    if (!locationId) {
        return res.status(400).json({
            success: false,
            message: "location ID is required"
        });
    }

    
    db.query("SELECT * FROM locations_centers WHERE locationId = ?", [locationId], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        // Proceed with deletion
        db.query("DELETE FROM locations_centers WHERE locationId = ?", [locationId], (err, result) => {
            if (err) {
                console.error("Delete Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete location",
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Location deleted successfully",
                deletedLocation: results[0] // Returns the deleted comment data
            });
        });
    });
};