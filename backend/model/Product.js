const mongoose = require("mongoose");
const { type } = require("os");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratingAndReviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ratings",
  },
  price: {
    type: Number,
  },
  thumbnails: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  // Product:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"Product",
  // },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  customerPurchase: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  orderby:[{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Order"
  }]
});

module.exports = mongoose.model("Product", productSchema);
