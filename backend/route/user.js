const express = require("express");
const router = express.Router();
const passport = require("passport");

const {login,signup,sendOTP,changePassword,loginWithGoogle, loginWithGoogleCallback,addAccountType,autoLogin, changeAccountType,isFollowing,followUser,unfollowUser} = require("../controller/Auth");
const {resetPassword,resetpasswordtoken} = require("../controller/ResetPassword");
const {auth} = require("../middleware/auth");



router.post("/login",login);
router.post("/signup",signup);
router.post("/addAccountType",addAccountType);
router.post("/sendOTP",sendOTP);
router.post("/followuser",followUser);
router.post("/isFollowing",isFollowing);
router.post("/unfollow",unfollowUser);
router.post("/changePassword",auth,changePassword);
router.post("/resetPasswordToken",resetpasswordtoken);
router.post("/resetPassword",resetPassword);
router.post("/changeAccountType",changeAccountType);
router.get('/google', loginWithGoogle);
router.get('/autoLogin', autoLogin);
router.get('/google/callback', loginWithGoogleCallback);
router.get("/login-success", (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({success:true})
    } else {
      res.status(401).json({ error: "Unauthorized access" });
    }
  });

module.exports = router;

