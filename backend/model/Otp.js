const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    timeStamp:{
        type:Date,
        default:Date.now(),
        expire: 5 * 60,
    },

});


async function sendVerificationMail(email,otp){
    try{
        const mailResponse = await mailSender(email,"verification mail from huehub",`Your One time password ,do not share with anyone ${otp}`);
        console.log("Email send successfully",mailResponse);
    }
    catch(error){
        console.log("error occure while sending mail",error);
        throw error;
    }
};

otpSchema.pre('save',async function(next){
    await sendVerificationMail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("Otp",otpSchema);