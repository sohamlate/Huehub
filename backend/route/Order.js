const express = require("express");
const router = express.Router();

const {saveAddress} = require("../controller/Order");

router.post("/saveAddress" , saveAddress);


module.exports = router;