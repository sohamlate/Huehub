const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    
   name:{
    type:String,
    required:true,
   },
   description:{
    type:String,
   },
   products:[
      {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Product",
      }
  ],
   image:{
      type:String,
   }


});

module.exports = mongoose.model("Category",categorySchema);