const Product = require("../model/Product");
const User = require("../model/User");
const {uploadImageToCloudinary} = require("../utils/ImageUploader");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category =  require("../model/Category");

exports.addToCart = async(req,res)=>{
    try{
        const {productId} = req.body;

        if(!productId){
            return res.status(400).jsin({
                success:false,
                message:"All fields are required",
            });
        }

        const {userID} = req.body;
        const sellerDetails = await User.findById(userID);
        
        if(!sellerDetails){
            return res.status(404).json({
                success:false,
                message:"seller not found",
            });
        }

        const quantity =1;

        await User.findByIdAndUpdate({_id:sellerDetails._id}, { $push: { cartProduct: { productId ,quantity} } },{new:true});
    
        return res.status(200).json({
            success:true,
            message:"product added to cart successfully",
        });    
    }
    catch(err){
        console.log("error while adding product to  cart",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.removeFromCart = async(req,res)=>{
    try{
        const productId = req.body.productId;

        if(!productId){
            return res.status(400).json({
                success:false,
                message:"All filelds are required",
            });
        }

        const {userID} = req.body;
        const sellerDetails = await User.findById(userID);
        
        if(!sellerDetails){
            return res.status(404).json({
                success:false,
                message:"seller not found",
            });
        }

        await User.findByIdAndUpdate({_id:sellerDetails._id}, { $pull: { cartProduct: { productId: productId } } },{new:true});

    
        return res.status(200).json({
            success:true,
            message:"product remove from cart successfully",
        });    
    }
    catch(err){
        console.log("error while deelting product from cart ",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.displayCartItem = async(req,res)=>{
    try{

        const userID = req.body.userID;
        if(!userID){
            return res.status(404).json({
                success:false,
                message:"user required",
            });
        }
        const sellerDetails = await User.findById(userID);
        
        if(!sellerDetails){
            return res.status(404).json({
                success:false,
                message:"seller not found",
            });
        }

        const user = await User.findById(sellerDetails._id)
      .populate({
        path: 'cartProduct.productId', // Path to populate
        model: 'Product', // Model to populate with
      })
      .exec();   
    
        return res.status(200).json({
            success:true,
            message:"cart data displaying successfully",
            cartItem : user.cartProduct,
        });    
    }
    catch(err){
        console.log("error while showing product from cart ",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}
exports.updateCart = async(req,res)=>{


    try {
        const { productId, userID, quantity } = req.body;
        
        if (!userID || !productId || quantity == null) {
            return res.status(400).json({
              success: false,
              message: "User ID, Product ID, and quantity are required",
            });
          }

          const user = await User.findById(userID);

          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
      
          const updateResult = await User.findOneAndUpdate(
            { _id: userID, "cartProduct.productId": productId },
            { $set: { "cartProduct.$.quantity": quantity } },
            { new: true }
          ).populate({
            path: "cartProduct.productId",
            model: "Product"
          }).exec();
      
          if (!updateResult) {
            return res.status(404).json({
              success: false,
              message: "Product not found in cart",
            });
          }
      
          return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cartProduct: updateResult.cartProduct,
          });
        } catch (err) {
          console.log("Error while updating cart", err);
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
    
}



