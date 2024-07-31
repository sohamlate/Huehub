const Order = require("../model/Order");
const Profile = require("../model/Profile");
const mongoose = require("mongoose");
const User = require("../model/User");
const Product = require("../model/Product");
exports.saveAddress = async (req, res) => {
  try {
    const { userId, address, pincode, city, state, country } = req.body;
    const existingUser = await User.findById(userId).populate("additionalDetail");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
    const userProfile = existingUser.additionalDetail;
    if(!userProfile){
      return res.status(404).json({
        success : false,
        message : "profile does not exist"
      })
    }
    const addressToSave = {
      street: address,
      city: city,
      state: state,
      postalCode: pincode,
      country: country,
    };
    userProfile.address.push(addressToSave);
    await userProfile.save();
    return res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
