import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImCross } from "react-icons/im";
const SellerProfile = ({ seller, user,isFollowing ,setIsFollowing ,setShowSeller}) => {
  const [products, setProducts] = useState([]);
  console.log(isFollowing);
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        seller.products.map((productId) => fetchProductById(productId))
      );
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, [seller.products]);

  const followUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/followuser", {
        artistId: seller._id,
        userId: user._id
      });
      setIsFollowing(true);
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/unfollow", {
        artistId: seller._id,
        userId: user._id
      });
      setIsFollowing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProductById = async (productId) => {
    const response = await axios.post(
      "http://localhost:4000/api/v1/product/getproductdetail",
      { productId }
    );
    return response.data; // Assuming the API response structure
  };

  return (
    <div className='bg-white rounded-md relative'>
      <div onClick={()=>setShowSeller(false)} className='bg-red-600 rounded-full p-2 text-white absolute -right-2 -top-1'><ImCross/></div>
      <div className='p-2 flex justify-center items-center font-poppins gap-x-3'>
        <img className='w-10 h-10 rounded-full' src={seller.image} alt='profilepic' />
        <div className='flex flex-col gap-y-3'>
          <p>{seller.firstname} {seller.lastname}</p>
          <p>{seller.email}</p>
        </div>
      </div>
      <div>
        Other Arts
        <div className='flex flex-wrap gap-2 p-2'>
          {products.slice(0, 5).map((product, index) => {
            const thumbnails = product.productDetails[0].thumbnails;
            const thumbnail = Array.isArray(thumbnails) ? thumbnails[0] : thumbnails;
            return thumbnail ? (
              <img key={index} className='w-20 h-20 object-cover' src={thumbnail} alt={`product-${index}`} />
            ) : null;
          })}
        </div>
      </div>
      <div className='flex justify-center'>
        {isFollowing ? (
          <p onClick={unfollowUser} className='bg-red-500 p-2 rounded-md text-white font-poppins my-2'>Unfollow</p>
        ) : (
          <p onClick={followUser} className='bg-sky-500 p-2 rounded-md text-white font-poppins my-2'>Follow</p>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
