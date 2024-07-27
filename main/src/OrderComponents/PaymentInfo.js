import React from "react";
import OrderItem from "./OrderItem";
const PaymentInfo = ({ cartItem }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-x-3 justify-center items-center">
        {cartItem.map((item, index) => (
          <div key={index} className="order-item">
            <OrderItem item={item}/>
          </div>
        ))}
      </div>
      <div className="order-total flex justify-center items-center">
        <p className="font-libre  mt-5 bg-black text-white p-1 rounded-md w-fit ">Total Price: ${cartItem.reduce((total, item) => total + item.price , 0)}</p>
      </div>
    </div>
  );
};

export default PaymentInfo;
