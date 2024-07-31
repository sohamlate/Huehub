const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
  },
  accountType: {
    type: String,
    enum: ["Seller", "Admin", "Customer"],
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  additionalDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  isnew: {
    type: Boolean,
    default: false,
  },
  cartProduct: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1, // Ensure quantity is always at least 1
      },
    },
  ],
  following: [
    {
      type: String,
    },
  ],
  follower: [
    {
      type: String,
    },
  ],

  likedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
