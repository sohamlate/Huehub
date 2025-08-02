const express = require("express");
const router = express.Router();
require("dotenv").config();

const {capturePayment, verifySignature,manyVerifySignature,manyCapturePayment} = require("../controller/Payments");
const {auth , isAdmin, isCustomer, isSeller} = require("../middleware/auth");
router.post("/capturePayment",auth,capturePayment);
router.post("/verifySignature",verifySignature);
router.post("/manyCapturePayment",auth,manyCapturePayment);
router.post("/manyVerifySignature",manyVerifySignature);
router.get("/key",(req,res)=>res.status(200).json({key:process.env.RAZORPAY_KEY}));

module.exports = router;
