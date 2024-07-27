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
      res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
    const userProfile = existingUser.additionalDetail;
    if(!userProfile){
      res.status(404).json({
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
    res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.placeOrder = async (req, res) => {
  try {
        const {
          userId,
          items,
          orderDate,
          totalPrice,
          deliveryAddress,
          paymentInfo,
        } = req.body;
       
        console.log(
          totalPrice
        );
        if (!userId || !items || !orderDate || !totalPrice || !deliveryAddress) {
          res.status(401).json({
            success: false,
            message: "Required feilds are not filled",
          });
        }
        console.log(21565);
        const existingUser = await User.findById({ _id: userId });
        if (!existingUser) {
          res.status(401).json({
            success: false,
            message: "user does not exist",
          });
        }
        for (const product in items) {
          const existingProduct = await Product.findById(product.productId);
          if (!existingProduct) {
            res.status(401).json({
              success: false,
              message: "Product does not exist",
            });
          }
        }
        const newOrder = await Order.create({
          userId: userId,
          items: items,
          totalPrice: totalPrice,
          orderDate: orderDate,
          deliveryAddress: deliveryAddress,
          shippingMethod: "default",
          paymentInfo: paymentInfo,
        });
        await User.findByIdAndUpdate(
          { _id: userId },
          { $push: { orders: newOrder._id } },
          { new: true }
        );
        for (const product in items) {
          const indexProduct = await Product.findById(product._id);

          await Product.findByIdAndUpdate(
            { _id: indexProduct._id },
            { $push: { orders: newOrder._id } },
            { new: true }
          );

        }
        res.status(200).json({
          success: true,
          message: "Order Placed Successfully",
    });
  } catch (err) {
      console.log("error occured while placing order  ",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
  }
};
