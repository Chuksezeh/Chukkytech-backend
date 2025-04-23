const express = require("express");
const { registerLocation, getAllLocations } = require("../controllers/locationController"); // ✅ Correct import

const router = express.Router();


router.post("/registerLocation", registerLocation);

router.get("/getAllLocations", getAllLocations);



module.exports = router;