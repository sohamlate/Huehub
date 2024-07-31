import React from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";
const CartHover = ({ item, user }) => {
  const firstThumbnail =
    Array.isArray(item.thumbnails) && item.thumbnails.length > 0
      ? item.thumbnails[0]
      : item.thumbnail;
  async function removefromcart() {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/product/removeFromCart",
        { productId: item._id, userID: user._id }
      );
      console.log("remove to cart", response);
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div className="bg-orange-50 p-2 rounded-md m-1">
      <div
        key={item.id}
        className="flex items-center justify-between mb-2 gap-x-2"
      >
        <img
          src={firstThumbnail}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
        <div className="ml-4">
          <p className="text-sm font-medium">{item.productName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">${item.price}</p>
        </div>
        <div onClick={() => removefromcart()} className=" text-amber-600">
          <RxCross2 />
        </div>
      </div>
    </div>
  );
};

export default CartHover;
