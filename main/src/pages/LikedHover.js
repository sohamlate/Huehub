import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const LikedHover = ({ item, user, ondislike, setOndislike }) => {
  const [details, setDetails] = useState(null);

  const dislike = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/product/likedProduct",
        { userId: user._id, productId: item }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const updateLiked = () => {
    dislike();
    setOndislike(!ondislike);
  };
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/product/getproductdetail",
          { productId: item }
        );
        setDetails(response.data.productDetails[0]);
      } catch (err) {
        console.log(err);
      }
    };

    getDetails();
  }, [item]);
  return (
    <div className="bg-pink-50 p-2 rounded-md m-1">
      {details && (
        <div className="flex items-center justify-between mb-2 gap-x-2">
          <img
            src={details.thumbnails?.[0] || details.thumbnail}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="">
            <p className="text-sm font-medium text-black">
              {details.productName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">${details.price}</p>
          </div>
          <div onClick={() => updateLiked()} className="text-amber-600">
            <RxCross2 />
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedHover;
