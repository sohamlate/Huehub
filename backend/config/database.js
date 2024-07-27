const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () =>{
    const db = process.env.MONGODB_URL
    console.log("Start working line ",db);
    mongoose.connect(db)
    .then(()=>{console.log("db connected successfuly")})
    .catch((err)=>{
        console.error(err);
        process.exit(1);
    });    


}