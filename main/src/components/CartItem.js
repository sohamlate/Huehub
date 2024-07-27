import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
const CartItem = ({ item, itemIndex, userID, showCart }) => {
  const [cart, setcart] = useState([]);
  const productId = item._id;
  const navigate = useNavigate();
  // const {cart} = useSelector((state)=>state.cart);
  // const dispatch = useDispatch();

  // function removefromcart(){
  //     dispatch(remove(item.id));
  //     toast.success("Removed from cart");
  //   }
  console.log(item);
  const firstThumbnail =
    Array.isArray(item.thumbnails) && item.thumbnails.length > 0
      ? item.thumbnails[0]
      : item.thumbnail;

  async function removefromcart() {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/product/removeFromCart",
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
    navigate(`/product/${item._id}`);
  }

  const truncatedDescription =
    item.productDescription.length > 30
      ? item.productDescription.substring(0, 70) + "..."
      : item.productDescription;

  return (
    <div className=" flex flex-wrap ">
      <div
        onClick={handleClick}
        className="relative w-[70vw] max-h-[400px]  bg-white h-fit  p-5 rounded-md hover:scale-105 transition-all duration-150 hover:shadow-md"
      >
        <div className=" flex flex-col md:flex-row gap-x-2 my-[1rem]">
          <img
            className="flex rounded-md w-[30%]"
            src={firstThumbnail}
            alt={item.productName}
          />
          <div className="flex flex-col text-xl ml-4 w-[53%]">
            <div className="font-poppins font-bold text-[#00246B]">
              <p>{item.productName}</p>
            </div>
            <div className="font-poppins hidden md:block">
              <p>{truncatedDescription}</p>
            </div>
          </div>
          <div className=" font-poppins flex flex-col">
            <p className="font-bold text-lg">Item Price: </p>
            <p>{item.price}</p>
          </div>
        </div>
        <div className=" bg-gray-300  h-0.5"></div>
        <div className="flex ">
          <div
            onClick={removefromcart}
            className=" text-gray-400 font-poppins w-fit rounded-md  p-2 mt-2 flex items-center justify-center gap-x-1 hover:cursor-pointer hover:text-red-500 hover:scale-105 transition-all duration-150"
          >
            <MdDelete />
            Remove
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
