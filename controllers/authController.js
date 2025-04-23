const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

// User Registration
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, userType, status } = req.body;
    const userId = uuidv4().replace(/-/g, "").substring(0, 15);
    const createdDateTime = new Date();

    db.query("SELECT * FROM registration WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO registration (userId, firstName, lastName, email, password, userType, status, createdDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, firstName, lastName, email, hashedPassword, userType, status, createdDateTime],
            (err, result) => {
                if (err) return res.status(500).json({ error: "Database error", details: err.message });
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    });
};

exports.updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || (status !== "suspended" && status !== "Active")) {
        return res.status(400).json({ 
            message: "Status is required and must be either 'suspended' or 'Active'" 
        });
    }

    db.query(
        "UPDATE registration SET status = ? WHERE userId = ?",
        [status, userId],
        (err, result) => {
            if (err) return res.status(500).json({ 
                error: "Database error", 
                details: err.message 
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "User not found" 
                });
            }

            res.status(200).json({ 
                message: "User status updated successfully",
                userId,
                newStatus: status
            });
        }
    );
};


// admin update status
exports.updateAdminStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || (status !== "suspended" && status !== "Active")) {
        return res.status(400).json({ 
            message: "Status is required and must be either 'suspended' or 'Active'" 
        });
    }

    db.query(
        "UPDATE admin_user_registrations SET status = ? WHERE userId = ?",
        [status, userId],
        (err, result) => {
            if (err) return res.status(500).json({ 
                error: "Database error", 
                details: err.message 
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "User not found" 
                });
            }

            res.status(200).json({ 
                message: "User status updated successfully",
                userId,
                newStatus: status
            });
        }
    );
};




// User Login

exports.registerAdminUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, userType, status, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const userId = uuidv4().replace(/-/g, "").substring(0, 15);
    const createdDateTime = new Date();

    try {
        // Check if email exists (callback version)
        db.query("SELECT * FROM admin_user_registrations WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                db.query(
                    "INSERT INTO admin_user_registrations (userId, firstName, lastName, email, phone, password, userType, status, role, createdDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [userId, firstName, lastName, email, phone, hashedPassword, userType, status || 'active', role || 'user', createdDateTime],
                    (err, result) => {
                        if (err) {
                            console.error("Database insert error:", err);
                            return res.status(500).json({ 
                                error: "Registration failed",
                                details: process.env.NODE_ENV === 'development' ? err.message : undefined
                            });
                        }
                        res.status(201).json({ message: "User registered successfully" });
                    }
                );
            } catch (hashError) {
                console.error("Password hashing error:", hashError);
                res.status(500).json({ error: "Registration failed" });
            }
        });
    } catch (outerError) {
        console.error("Registration process error:", outerError);
        res.status(500).json({ error: "Registration failed" });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM registration WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        console.log("alllerror", err)
        if (results.length === 0) return res.status(401).json({ message: "User not found" });

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            createdDateTime: user.createdDateTime,
            email: user.email
        });
    });
};



// admin login 

exports.loginAdminUser = async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM admin_user_registrations  WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(401).json({ message: "User not found" });
        
        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            createdDateTime: user.createdDateTime,
            email: user.email
        });
    });
};

exports.getAllUsers = (req, res) => {
    db.query("SELECT * FROM registration ORDER BY createdDateTime DESC", (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(results);
    });
};

exports.getAllAdminUsers = (req, res) => {
    db.query("SELECT * FROM admin_user_registrations ORDER BY createdDateTime DESC", (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(results);
    });
};


exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    db.query("SELECT * FROM registration WHERE userId = ?", [userId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        db.query("DELETE FROM registration WHERE userId = ?", [userId], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ error: "Failed to delete user" });
            }

            res.status(200).json({
                success: true,
                message: "User successfully deleted",
                userId: userId
            });
        });
    });
};


exports.deleteAdminUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    db.query("SELECT * FROM admin_user_registrations WHERE userId = ?", [userId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        db.query("DELETE FROM admin_user_registrations WHERE userId = ?", [userId], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ error: "Failed to delete user" });
            }

            res.status(200).json({
                success: true,
                message: "User successfully deleted",
                userId: userId
            });
        });
    });
};

