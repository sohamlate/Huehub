const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating:{
        type:String,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }


});

module.exports = mongoose.model("Rating",ratingSchema);