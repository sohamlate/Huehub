const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");


exports.resetPassword = async (req,res)=>{
    try{
        const {email} = req.body;

        const user = await  User.findOne({email:email});

        if(!user){
            return res.status(403).json({
                success:false,
                message:"User not exist ",
            });
        }

        const token = crypto.randomUUID();

        const updateDetail = await User.findOneAndUpdate({email},{token,resetPasswordExpires: Date.now() + 5*60*1000},{new:true});

        const url = `http://localhost:3000/update-password/${token}`

        await mailSender(email,"message from huehub",`password reset link ${url}`);

        return res.status(200).json({
            success:true,
            message:"Email send successfully please check email and change password",
        });
    }

    catch(err){
        console.log("error while sending mail for reset password",err);
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

exports.resetpasswordtoken = async(req,res)=>{
    try{
        const {password , confirmPassword , token} = req.body;

        if(!password || !confirmPassword || !token){
            return res.status(401).json({
                success:false,
                message:"All fields are mandatory",
            });
        }

        if(password !== confirmPassword){
            return res.status(403).json({
                success:false,
                message:"confirm password is not matching with password",
            });
        }

        const userDetail = User.findOne({token});

        if(!userDetail){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
            });
        }

        if(userDetail.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success:false,
                messsage:"Token is expired , please regenerate your token ",
            });
        }

        const hashPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate(
            {token:token}, 
            {password:hashPassword},
            {new:true},
        )

        return res.status(200).json({
            success:true,
            message:"Password reset successful",
        });
    }
    catch(err){
        console.log("error occured while resetting the password",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}