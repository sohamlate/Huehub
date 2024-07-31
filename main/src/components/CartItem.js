import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
const CartItem = ({ user,item, itemIndex, cart,userID, showCart }) => {
  const productId = item.productId;
  const navigate = useNavigate();


  console.log(cart,item,"fdjksjhngdbg");

  const updateCartQuantity = async (productId, action) => {
    try {
      // Determine the quantity to set based on action
      const product = cart.find((p) => p.productId._id === productId);
      let newQuantity = product.quantity;
  
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
      }
  
      await axios.post("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/updateCartQuantity", {
        productId,
        userID,
        quantity: newQuantity
      });
  
      // Refresh the cart items
      showCart();
      toast.success(action === 'increase' ? "Quantity increased" : "Quantity decreased");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const firstThumbnail =
    Array.isArray(item.productId.thumbnails) && item.productId.thumbnails.length > 0
      ? item.productId.thumbnails[0]
      : item.productId.thumbnail;

  async function removeFromCart() {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/removeFromCart",
        { productId, userID }
      );
      console.log("remove to cart", response);
      showCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleClick() {
    navigate(`/product/${item.productId._id}`, { state: { user } });
  }

  const truncatedDescription =
    item.productId.productDescription.length > 30
      ? item.productId.productDescription.substring(0, 70) + "..."
      : item.productId.productDescription;

  return (
    <div className=" flex flex-wrap ">
      <div
      
        className="relative w-[70vw] max-h-[400px]  bg-white h-fit  p-5 rounded-md hover:scale-105 transition-all duration-150 hover:shadow-md"
      >
        <div   onClick={handleClick} className=" flex flex-col md:flex-row gap-x-2 my-[1rem]">
          <img
            className="flex rounded-md w-[30%] h-[15rem]"
            src={firstThumbnail}
            alt={item.productId.productName}
          />
          <div className="flex flex-col text-xl ml-4 w-[53%]">
            <div className="font-poppins font-bold text-[#00246B]">
              <p>{item.productId.productName}</p>
            </div>
            <div className="font-poppins hidden md:block">
              <p>{truncatedDescription}</p>
            </div>
          </div>
          <div className=" font-poppins flex flex-col">
            <p className="font-bold text-lg">Item Price: </p>
            <p>{item.productId.price}</p>
          </div>
        </div>
        <div className=" bg-gray-300  h-0.5"></div>
        <div className="flex ">
        <div className=" mt-[2rem] items-center">
        {cart && cart.some((p) => p.productId._id === item.productId._id) && (
          <div className="flex items-center">
              <button
                className="border px-[5%] remove h-[2.5rem] mx-[0.1rem] w-[10rem] rounded-md text-white text-sm font-semibold bg-red-800"
                onClick={() => removeFromCart(item.productId._id)} // Pass item._id to identify which item to remove
              >
                Remove Item
              </button>
              <button
                className="border px-[5%] h-[2.5rem] mx-[1rem] w-[3rem] rounded-md text-white font-semibold bg-blue-800"
                onClick={() => updateCartQuantity(item.productId._id, 'decrease')} // Pass item._id and action
              >
                -
              </button>
              <p className="text-lg font-bold mx-[1rem]">
                Quantity: {
                  cart.find((p) => p.productId._id === item.productId._id)?.quantity || 0
                }
              </p>
              <button
                className="border px-[5%] h-[2.5rem] mx-[1rem] w-[3rem] rounded-md text-white font-semibold bg-blue-800"
                onClick={() => updateCartQuantity(item.productId._id, 'increase')} // Pass item._id and action
              >
                +
              </button>
            </div>
          )}

            </div>
          <div className="text-gray-400 font-poppins w-fit rounded-md  p-2 mt-2 flex items-center justify-center gap-x-1 hover:cursor-pointer hover:text-red-500 hover:scale-105 transition-all duration-150">
              <FaRegHeart/>
              Add to Wishlist
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
