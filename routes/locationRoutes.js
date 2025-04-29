const express = require("express");
const { registerLocation, getAllLocations, updateLocation, deleteLocation } = require("../controllers/locationController"); // ✅ Correct import

const router = express.Router();


router.post("/registerLocation", registerLocation);

router.get("/getAllLocations", getAllLocations);

router.put("/updateLocation/:locationId", updateLocation);
router.delete("/deleteLocation/:locationId", deleteLocation)



module.exports = router;