const db = require("../config/db");

const getUserByEmail = (email, callback) => {
    db.query("SELECT * FROM registration WHERE email = ?", [email], callback);
};

const createUser = (userData, callback) => {
    const { userId, firstName, lastName, email, password, createdDateTime } = userData;
    db.query(
        "INSERT INTO registration (userId, firstName, lastName, email, password, createdDateTime) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, firstName, lastName, email, password, createdDateTime],
        callback
    );
};

module.exports = { getUserByEmail, createUser };
