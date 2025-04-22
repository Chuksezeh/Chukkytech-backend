const express = require("express");
const { registerUser, loginUser, registerAdminUser, loginAdminUser, getAllUsers } = require("../controllers/authController"); // ✅ Correct import

const router = express.Router();


router.post("/registerAdminUser", registerAdminUser);
router.post("/loginAdminUser", loginAdminUser);
router.get("/getAllUsers", getAllUsers)
router.post("/registeration", registerUser);
router.post("/userLogin", loginUser); 



module.exports = router;



