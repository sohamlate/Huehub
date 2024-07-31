import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../assests/logo.png";
import { useNavigate } from "react-router-dom";

const Finish = ({ cartItem, user, formData }) => {


  const productId = cartItem[0]._id;
  const userID = user._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const items = cartItem.map((item) => ({
    productId: item._id,
  }));


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const orderCreation = async () => {
    try {
      console.log(totalPrice , items,"fdjkgbuhsgfidsgbfib");
      const orderResponse = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/order/placeOrder",
        {
          userId: userID,
          items: items,
          orderDate: Date.now(),
          totalPrice: totalPrice,
          deliveryAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.pincode,
          }
        }
      );
      console.log("72115", orderResponse);
    } catch (err) {
      console.log("hiu");
      console.log(err);

    }
  };

  const verifyStatus = async (response) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        response;
      await axios.post("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/verifySignature", {
        R_id: razorpay_payment_id,
        R_order: razorpay_order_id,
        R_sign: razorpay_signature,
        product_id: productId,
        userId: userID,
      });
      
      toast.success("Payment successful");
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
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/capturePayment",
        {
          product_id: productId,
          userId: userID,
          token,
        }
      );
      console.log(response,"payment");
      toast.success("Order id created");
      setTotalPrice(response.data.amount);
      const options = {
        key,
        amount: response.data.amount,
        currency: "INR",
        name: "Huehub",
        description: "Thank you Purchasing",
        image: Logo,
        order_id: response.data.orderId,
        handler: verifyStatus,
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

      await orderCreation();
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };
  console.log("First change");
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
