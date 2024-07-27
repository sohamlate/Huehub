const User = require("../model/User");
const OTP = require("../model/Otp");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../model/Profile");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkuserpresent = await User.findOne({ email }).maxTimeMS(30000);

    if (checkuserpresent) {
      return res.status(401).json({
        success: false,
        message: "User already exist ",
      });
    }

    var otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp generated", otp);

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      var otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "Otp generated successfully",
      otp,
    });
  } catch (error) {
    console.log("problem in otp generation", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        succees: false,
        message: "All field are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password does not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    let recentOtp = 0;
    const recentOtp1 = await OTP.find({ email })
      .sort({ _id: -1 })
      .limit(1)
      .exec();
    if (recentOtp1) {
      recentOtp = recentOtp1[0].otp;
    }

    console.error(
      "helllo bhai here",
      otp,
      "bicha ka bhai ",
      recentOtp,
      "end of bhai"
    );
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== recentOtp) {
      return res.status(400).json({
        success: false,
        message: "otp incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const profileDetail = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNo: null,
    });

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
      contactNo: contactNumber,
      accountType,
      additionalDetail: profileDetail._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,
    });

    const payload = {
      email: user.email,
      accountType: user.accountType,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRETE, {
      expiresIn: "2h",
    });

    user.token = token;
    user.password = undefined;

    const options = {
      expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "login successfully",
    });
  } catch (error) {
    console.log("error occured while sign up", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All Field are mandatory",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "please sign up first ",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        accountType: user.accountType,
        id: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRETE, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "login successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password not matching",
      });
    }
  } catch (err) {
    console.log("error occured while login ", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.autoLogin = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found ",
      });
    }
    console.log("printing token in the autologin ", token);

    const response = jwt.verify(token, process.env.JWT_SECRETE);
    if (!response) {
      console.log("gadbad hai bhai");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    console.log("unwrap token ", response);
    const email = response.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    console.log("autologin backend ", response);
    if (!response) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    //     response.password = null;
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.addAccountType = async (req, res) => {
  try {
    const { email, accountType } = req.body;

    if (!email || !accountType) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    await User.findOneAndUpdate(
      { email },
      { accountType: accountType },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "updated suceessfully",
    });
  } catch (err) {
    console.log("error occured while changing account type ", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// exports.addAccountType

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(401).res({
        success: false,
        message: "All field are mandatary",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "Confirm password is different",
      });
    }

    const user = User.findOne({ email });

    if (!user) {
      return res.status(403).res({
        succees: false,
        message: "User not exist",
      });
    }

    if (await bcrypt.compare(oldPassword, user.password)) {
      user.password = newPassword;

      try {
        const mailResponse = await mailSender(
          email,
          "Message from huehub",
          "Your Password change succcessfully"
        );
        console.log("Email send successfully", mailResponse);
      } catch (error) {
        console.log("error occure while sending mail", error);
        throw error;
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is not matching ",
      });
    }
  } catch (err) {
    console.log("error occured while changing password ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const passport = require("passport");
const { verifyCallback } = require("../middleware/logingoogle");

exports.loginWithGoogle = passport.authenticate("google", {
  failureRedirect: "http://localhost:3000/login",
});

exports.loginWithGoogleCallback = async (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      // if (req.isAuthenticated()) {
      //     return res.redirect('http://localhost:3000/login-success');
      // }

      if (!user) {
        return res.redirect("http://localhost:3000/login");
      }

      const existingUser = await User.findOne({ email: user.email });
      console.log(existingUser);

      if (!existingUser.isnew) {
        req.logIn(existingUser, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("http://localhost:3000/");
        });
      } else {
        existingUser.isnew = false;
        await existingUser.save();
        return res.redirect("http://localhost:3000/accountType");
      }
    } catch (error) {
      console.error("Error during Google login callback:", error);
      return res.redirect("http://localhost:3000/login");
    }
  })(req, res, next);
};

exports.changeAccountType = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All Field are mandatory",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "please sign up first ",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      user.password = undefined;
      if (user.accountType !== "Seller") {
        const newuser = await User.findOneAndUpdate(
          { email: email },
          { accountType: "Seller" }
        );
        return res.status(200).json({
          success: true,
          message: "Account Type updated Successfully",
          newuser,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Already seller account",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Password not matching",
      });
    }
  } catch (err) {
    console.log("error occured while changing account type ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.followUser = async (req, res) => {
  try {
    const { userId, artistId } = req.body;
    const existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      res.status(401).json({
        succees: false,
        message: "User does not exist",
      });
    }
    const existingArtist = await User.findById({ _id: artistId });
    if (!existingArtist) {
      res.status(401).json({
        succees: false,
        message: "Artist does not exist",
      });
    }
    if (existingUser.following.includes(artistId)) {
      res.status(400).json({
        succees: false,
        message: "You are alredy following this artist",
      });
    }
    existingUser.following.push(artistId);
    await existingUser.save();
    existingArtist.follower.push(userId);
    await existingArtist.save();
    res.status(200).json({
      succees: true,
      message: "Followed successfully",
    });
  } catch (err) {
    res.status(404).json({
      succees: false,
      message: err,
    });
  }
};
exports.unfollowUser = async (req, res) => {
  try {
    const { userId, artistId } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    const existingArtist = await User.findById(artistId);
    if (!existingArtist) {
      return res.status(401).json({
        success: false,
        message: "Artist does not exist",
      });
    }

    if (existingArtist.follower.includes(userId)) {
      existingArtist.follower = existingArtist.follower.filter(
        (followerId) => followerId.toString() !== userId
      );

      existingUser.following = existingUser.following.filter(
        (followingId) => followingId.toString() !== artistId
      );

      await existingArtist.save();
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "Successfully unfollowed the artist",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "You are not following this artist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isFollowing = async (req, res) => {
  console.log("hello");
  try {
    const { userId, artistId } = req.body;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    const existingArtist = await User.findById(artistId);
    if (!existingArtist) {
      return res.status(401).json({
        success: false,
        message: "Artist does not exist",
      });
    }

    const isFollowing = existingArtist.follower.includes(existingUser._id);
    return res.status(200).json({
      success: true,
      isFollowing,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
};
