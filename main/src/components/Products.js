import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import axios from "axios";
import { FaCartArrowDown } from "react-icons/fa";

const Products = ({ item, user, isLiked, setIsLiked }) => {
  const head = item.productName;
  const [displayHead, setDisplayHead] = useState(head);
  const navigate = useNavigate();

  useEffect(() => {
    if (head.length > 30) {
      setDisplayHead(head.slice(0, 30) + "...");
    } else {
      setDisplayHead(head);
    }
  }, [head]);

  function handleClick() {
    navigate(`/product/${item._id}`, { state: { user } });
  }

  async function handleLikeClick(event) {
    event.stopPropagation();
    setIsLiked(!isLiked);

    try {
      let response = await axios.post('https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/likedProduct', {
        userId: user._id,
        productId: item._id
      });
      console.log("12316464", response);
    } catch (error) {
      console.error('Error liking the product:', error);
    }
  }

  const firstThumbnail = Array.isArray(item.thumbnails) && item.thumbnails.length > 0
    ? item.thumbnails[0]
    : item.thumbnail;

  return (
    <div
      onClick={handleClick}
      className="relative h-[325px] bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 max-w-[280px] p-5 rounded-md border-white product-card"
    >
      <div
        className="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 like-button"
        onClick={handleLikeClick}
      >
        {isLiked ? <FcLike size={24} /> : <FcLikePlaceholder size={24} />}
      </div>
      <div className="flex justify-center my-[1rem] h-[9rem]">
        <img className="flex rounded-md w-15" src={firstThumbnail} alt={item.productName} />
      </div>
      <div>
        <p className="text-center bg-[#00246B] text-white p-1 rounded-md mx-4 like-button">Add to cart</p>
      </div>
      <div className="bg-[#00246B] w-full h-1 my-2"></div>
      <div className="text-xl">
        <div className="font-roboto font-bold text-[#00246B] text-center">
          <p>{displayHead}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p> Rs {item.price}</p>
      </div>
    </div>
  );
};

export default Products;
