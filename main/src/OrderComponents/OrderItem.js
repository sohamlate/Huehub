import React from "react";

const OrderItem = ({ item }) => {
  const firstThumbnail =
    Array.isArray(item.thumbnails) && item.thumbnails.length > 0
      ? item.thumbnails[0]
      : item.thumbnail;
  return (
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
  );
};

export default OrderItem;
