const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController"); // ✅ Correct import

const router = express.Router();

router.post("/register", registerUser);
router.post("/userLogin", loginUser); 

module.exports = router;



