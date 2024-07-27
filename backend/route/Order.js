const express = require("express");
const router = express.Router();

const {saveAddress,placeOrder} = require("../controller/Order");

router.post("/saveAddress" , saveAddress);
router.post("/placeOrder" , placeOrder);

module.exports = router;