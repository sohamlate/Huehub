const { instance } = require("../config/razorpay");
const Product = require("../model/Product");
const User = require("../model/User");
const Order = require("../model/Order");
const mailsender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

exports.capturePayment = async (req, res) => {
  const { product_id } = req.body;
  const { userId } = req.body;

  if (!product_id) {
    return res.status(403).json({
      success: false,
      message: "Please provide currrent product id",
    });
  }

  let product;
  try {
    product = await Product.findById(product_id);
    if (!product) {
      return res.status(403).json({
        success: false,
        message: "Could not find the product",
      });
    }

    // Here point is that user may purchase multiple product
    //  const uid = new mongoose.Types.ObjectId(userId);
    // if(product.customerPurchase.includes(userId)){
    //     return res.status(200).json({
    //         success:false,
    //         message:"customer is already purchased",
    //     });
    // }
  } catch (err) {
    console.log("error occured in capturing paymant ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  try {
    const amount = product.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        productId: product_id,
        userId,
      },
    };
    const paymentResponse = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      productName: product.productName,
      productDescription: product.productDescription,
      thumbnail: product.thumbnails,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (err) {
    console.log("error occured in creating paymant ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.manyCapturePayment = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId)
    .populate({
      path: 'cartProduct.productId', // Path to populate
      model: 'Product', // Model to populate with
    })
    .exec(); 

  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartProducts = user.cartProduct;
    if (!cartProducts || cartProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in cart",
      });
    }

    let totalAmount = 0;
    cartProducts.forEach(product => {
      totalAmount += product.productId.price * product.quantity; // Assuming each product has a `price` field
    });

    console.log(totalAmount);

    const amount = totalAmount ;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });

  } catch (err) {
    console.log("error occzcdszcured in creating paymant ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifySignature = async (req, res) => {
  
  let body = `${req.body.R_order}|${req.body.R_id}`;
  const signature = req.body.R_sign;
  const shasum = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRETE)
    .update(body)
    .digest("hex");

  if (signature === shasum) {
    const { product_id, userId, orderDate, totalPrice, deliveryAddress } = req.body;

    try {
      const enrolledProduct = await Product.findOneAndUpdate(
        { _id: product_id },
        { $push: { customerPurchase: userId } },
        { new: true }
      );

      if (!enrolledProduct) {
        return res.status(500).json({
          success: false,
          message: "product not found",
        });
      }

      const purchaseCustomer = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { products: product_id } },
        { new: true }
      );

      const item = {
        itemId: product_id,
        quantity: 1,
      };

      
      const newOrder = await Order.create({
        userId: userId,
        items: item,
        totalPrice: totalPrice,
        orderDate: orderDate,
        deliveryAddress: deliveryAddress,
        shippingMethod: "default",
      });
      
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { orders: newOrder._id } },
        { new: true }
      );
           
      const emailResponse = await mailsender(
        purchaseCustomer.email,
        "Congratulation from huehub",
        "Congratution payment is successful"
      );


      return res.status(200).json({
        success: true,
        message: "Signature is valid",
      });


    } catch (err) {

      console.log("error occured in verifying paymant ", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
      
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};

exports.manyVerifySignature = async (req, res) => {
  let body = `${req.body.R_order}|${req.body.R_id}`;
  const signature = req.body.R_sign;
  const shasum = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRETE)
    .update(body)
    .digest("hex");

  if (signature === shasum) {
    console.log("Payment is authorized");
    const { product_id, userId,orderDate, totalPrice, deliveryAddress } = req.body;

    try {
      const user = await User.findOne({ _id: userId });
      console.log(user);
      const products = user.cartProduct;
      if (!products) {
        return res.status(500).json({
          success: false,
          message: "no products",
        });
      }

      await Promise.all(
        products.map(async (product) => {
          const enrolledProduct = await Product.findOneAndUpdate(
            { _id: product.productId },
            { $push: { customerPurchase: userId } },
            { new: true }
          );

          if (!enrolledProduct) {
            return res.status(500).json({
              success: false,
              message: "product not found",
            });
          }
        })
      );

      await Promise.all(
        products.map(async (product) => {
          const purchaseCustomer = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { products: product.productId } },
            { new: true }
          );
        })
      );

      const items = products.map(product => ({
        itemId: product.productId,
        quantity: product.quantity // Assuming each product has a quantity of 1, adjust as needed
      }));

   

      
      const newOrder = await Order.create({
        userId: userId,
        items: items,
        totalPrice: totalPrice,
        orderDate: orderDate,
        deliveryAddress: deliveryAddress,
        shippingMethod: "default",
      });
      
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { orders: newOrder._id } },
        { new: true }
      );



      const emailResponse = await mailsender(
        user.email,
        "Congratulation from huehub",
        "Congratution payment is successful"
      );

      user.cartProduct = [];
      user.save();

      return res.status(200).json({
        success: true,
        message: "Signature is valid",
      });
    } catch (err) {
      console.log("error occured in verifying paymant ", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
