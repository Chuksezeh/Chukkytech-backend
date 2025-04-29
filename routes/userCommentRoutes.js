const express = require("express");
const { createUserComment, getAllComments, updateCommentStatus, deleteComment } = require("../controllers/userCommentController");


const router = express.Router();


router.post("/createUserComment", createUserComment);

 router.get("/getAllComments", getAllComments);

 router.put("/updateCommentStatus", updateCommentStatus);
router.delete("/deleteComment/:commentId", deleteComment);




module.exports = router;