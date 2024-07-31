import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../assests/logo.png";
import { useNavigate } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";

const Finish = ({ cartItem, user, formData, cartBuy , setCartBuy }) => {


  const productId = cartItem[0]._id;
  const userID = user._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let totalPrice = 0;
   


  const items = cartBuy ? cartItem.map((item) => ({
    productId: item.productId._id,
  })) : [];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  


  const verifyStatus = async (response) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      await axios.post("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/verifySignature", {
        R_id: razorpay_payment_id,
        R_order: razorpay_order_id,
        R_sign: razorpay_signature,
        product_id: productId,
        userId: userID,
        items: items,
        orderDate: Date.now(),
        totalPrice: totalPrice/100,
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.pincode,
        },
      });

      
      toast.success("Payment successful");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const verifyStatusMany = async(response)=> {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
       await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/manyVerifySignature",
        {
          R_id: razorpay_payment_id,
          R_order: razorpay_order_id,
          R_sign: razorpay_signature,
          product_id: productId,
          userId: userID,
          orderDate: Date.now(),
          totalPrice: totalPrice/100,
          deliveryAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.pincode,
          }
        }
      );
      toast.success("Payment successful");
      setCartBuy(false);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };


  const buyHandler = async () => {
    try {
      const {
        data: { key },
      } = await axios.get("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/key");

      const response = cartBuy
       ?  await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/manyCapturePayment",
        {
          userId: userID,
          token,
        }
      )
       : await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/capturePayment",
        {
          product_id: productId,
          userId: userID,
          token,
        }
      );
      console.log(response,"payment");
      toast.success("Order id created");
      totalPrice = response.data.amount;

      const options = {
        key,
        amount: response.data.amount,
        currency: "INR",
        name: "Huehub",
        description: "Thank you Purchasing",
        image: Logo,
        order_id: response.data.orderId,
        handler:cartBuy ? verifyStatusMany : verifyStatus,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.additionalDetail.contactNumber,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      razor.on('payment.failed' , function (response){
        toast.error("Payment Failed");
      });

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-4">Finish</h2>
      <div>
        <p
          onClick={() => buyHandler()}
          className="bg-fuchsia-700 text-white font-poppins rounded-md p-2 w-fit flex justify-center items-center"
        >
          Place Order
        </p>
      </div>
    </div>
  );
};

export default Finish;
