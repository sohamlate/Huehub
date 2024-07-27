const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");


exports.auth = async(req,res,next) =>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found ",
            });
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRETE);
            req.user = decode;
            next();
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is invalid", 
            });
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Error occured while verifying token",
        });
    }
}

exports.isCustomer = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Customer"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for customer",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified ",
        });
    }
}

exports.isSeller = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Seller"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for seller",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified ",
        });
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified ",
        });
    }
}

