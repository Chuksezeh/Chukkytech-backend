const express = require("express");
const { registerUser, 
      loginUser,
     registerAdminUser,
     loginAdminUser,
      getAllUsers,
     updateUserStatus, 
     deleteUser, 
     deleteAdminUser,
     updateAdminStatus,
     getAllAdminUsers } = require("../controllers/authController"); // ✅ Correct import

const router = express.Router();


router.post("/registerAdminUser", registerAdminUser);
router.post("/loginAdminUser", loginAdminUser);
router.get("/getAllUsers", getAllUsers);
router.get("/getAllAdminUsers", getAllAdminUsers)
router.post("/registeration", registerUser);
router.post("/userLogin", loginUser); 
router.put("/updateUserStatus/:userId", updateUserStatus); 
router.delete("/deleteUser/:userId", deleteUser);
router.put("/updateAdminStatus/:userId", updateAdminStatus); 
router.delete("/deleteAdminUser/:userId", deleteAdminUser);











module.exports = router;



