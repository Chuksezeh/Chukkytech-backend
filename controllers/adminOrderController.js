const db = require("../config/db");


exports.getAllOrders = (req, res) => {
    db.query("SELECT * FROM repairorder ORDER BY createdDateTime DESC", (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(results);
    });
};

