const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth");
const {deleteProfile,updateProfile,getUserAllData} = require("../controller/Profile");

router.delete("/deleteProfile",deleteProfile);
router.post("/updateProfile",updateProfile);
router.post("/getUserData",getUserAllData);
// purchase_product update_display_pictures  
module.exports = router


