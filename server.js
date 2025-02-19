

require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const { v4: uuidv4 } = require("uuid"); // Import UUID generator


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Set password if required
    database: 'chukky_tech'
});

// Database connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Sample API Route
app.get("/registration", (req, res) => {
    db.query("SELECT * FROM registration", (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(results);
    });
});



app.post("/registration", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userId = uuidv4().replace(/-/g, "").substring(0, 15); // Generate 15-char ID
    const createdDateTime = new Date(); // Get current timestamp

    const sql = "INSERT INTO registration (userId, firstName, lastName, email, password, createdDateTime) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [userId, firstName, lastName, email, password, createdDateTime], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.status(201).json({ 
            message: "User added successfully", 
            userId,
            createdDateTime 
        });
    });
});

const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});