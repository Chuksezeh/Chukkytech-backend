const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

// User Registration
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userId = uuidv4().replace(/-/g, "").substring(0, 15);
    const createdDateTime = new Date();

    db.query("SELECT * FROM registration WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO registration (userId, firstName, lastName, email, password, createdDateTime) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, firstName, lastName, email, hashedPassword, createdDateTime],
            (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    });
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM registration WHERE email = ?", [email], async (err, results) => {
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
