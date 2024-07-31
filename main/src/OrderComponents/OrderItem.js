import React from "react";

const OrderItem = ({ item , cartBuy , setCartBuy }) => {

  console.log(item,"dfnjdsfnoids");

  const firstThumbnail = cartBuy 
  ? (Array.isArray(item.productId?.thumbnails) && item.productId.thumbnails.length > 0 
      ? item.productId.thumbnails[0] 
      : item.productId.thumbnail) 
  : item.thumbnail;

  return cartBuy ? (
 
      <div className="flex flex-col justify-center shadow-md items-center w-fit p-2 rounded-md font-poppins bg-slate-200">
        <div className="">
          <img src={firstThumbnail} className="w-20 h-20" />
        </div>
        <div className="bg-white h-0.5 w-full my-2"></div>
        <div className="flex justify-center items-center gap-x-2">
          <p className="font-bold">{item.productId.productName}</p>
          <p className="bg-green-500 text-white p-1 rounded-md">Rs.{item.productId.price}</p> 
          <p className="bg-green-500 text-white p-1 rounded-md">* {item.quantity}</p> 
        </div>
      </div>
  )

      : 
(
      <div className="flex flex-col justify-center shadow-md items-center w-fit p-2 rounded-md font-poppins bg-slate-200">
        <div className="">
          <img src={firstThumbnail} className="w-20 h-20" />
        </div>
        <div className="bg-white h-0.5 w-full my-2"></div>
        <div className="flex justify-center items-center gap-x-2">
          <p className="font-bold">{item.productName}</p>
          <p className="bg-green-500 text-white p-1 rounded-md">Rs.{item.price}</p> 
        </div>
      </div>
)

  
  
};

export default OrderItem;
