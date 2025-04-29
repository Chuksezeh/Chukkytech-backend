const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");




exports.createUserComment = async (req, res) => {
    const {
        userId,
        repairOrderCode,
        firstName,
        lastName,
        email,
        phone,
        title,
        comment,
        status,
        updatedDateTime = null
    } = req.body;
    const commentId = uuidv4().replace(/-/g, "").substring(0, 15);
    const createdDateTime = new Date();

    const sql = `
      INSERT INTO user_comments
        ( 
        commentId,
        userId,
        repairOrderCode, 
        firstName,
        lastName, 
        email, 
        phone,
        title,
        comment,
        status,
        createdDateTime,
        updatedDateTime
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        commentId,
        userId,
        repairOrderCode,
        firstName,
        lastName,
        email,
        phone,
        title,
        comment,
        status,
        createdDateTime,
        updatedDateTime
    ];

    console.log("Comment SQL:", sql);
    console.log("Params:", params);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Comment INSERT ERROR:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(201).json({ message: "Comment submited successfully" });
    });
};


exports.getAllComments = (req, res) => {
    // First, check what status values actually exist
    db.query("SELECT DISTINCT status FROM user_comments", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        console.log("Existing status values:", results);
        
        db.query(`
            SELECT * 
            FROM user_comments 
            ORDER BY createdDateTime DESC
        `, (err, filteredResults) => {
            if (err) return res.status(500).json({ error: err });
            res.json(filteredResults);
        });
    });
};

exports.updateCommentStatus = async (req, res) => {
    const { commentId, status } = req.body;




    const updatedDateTime = new Date();

    const sql = `
      UPDATE user_comments
      SET 
        status = ?,
        updatedDateTime = ?
      WHERE commentId = ?
    `;
    const params = [status, updatedDateTime, commentId];

    console.log("Update Comment Status SQL:", sql);
    console.log("Params:", params);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Comment UPDATE ERROR:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ 
            message: "Comment status updated successfully",
            updatedDateTime: updatedDateTime
        });
    });
};


exports.deleteComment = (req, res) => {
    const { commentId } = req.params;
    console.log('Received update request:', req.body);
    if (!commentId) {
        return res.status(400).json({
            success: false,
            message: "Comment ID is required"
        });
    }

    // First verify the comment exists
    db.query("SELECT * FROM user_comments WHERE commentId = ?", [commentId], (err, results) => {
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
                message: "Comment not found"
            });
        }

        // Proceed with deletion
        db.query("DELETE FROM user_comments WHERE commentId = ?", [commentId], (err, result) => {
            if (err) {
                console.error("Delete Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete comment",
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
                deletedComment: results[0] // Returns the deleted comment data
            });
        });
    });
};