import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import ProductImage from "./ProductImage";
import Logo from "../assests/logo.png";
import Rating from "../components/Rating";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import Sellerprofile from "./Sellerprofile";
import Confirmation from "./Confirmation";
const Producturl = ({ user, isLoggedIn }) => {
  const location = useLocation();
  const [buyPage, setBuyPage] = useState(false);
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const productId = location.pathname.split("/")[2];
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const userID = user._id;
  const [posts, setPosts] = useState([]);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const [rating, setRating] = useState();
  const [showSeller, setShowSeller] = useState(false);
  const seller = item.seller;
  const cartItem = [item];
  useEffect(() => {
    if (text.length > 200) {
      setDisplayText(text.slice(0, 200) + "...");
    } else {
      setDisplayText(text);
    }
  }, [text]);
  const checkIfFollowing = async () => {
    setShowSeller(!showSeller);
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/auth/isFollowing",
        {
          userId: user._id,
          artistId: seller._id,
        }
      );
      console.log("1", response);
      setIsFollowing(response.data.isFollowing);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchItem = async () => {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getproductdetail",
        { productId }
      );
      const productDetails = response.data.productDetails[0];
      setItem(productDetails);
      setSelectedImage(
        productDetails.thumbnails[0] || productDetails.thumbnail
      );
      setText(productDetails.productDescription || "");
      if (productDetails.category) {
        setPosts(productDetails.category.products);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const showCart = async () => {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/displayCartItem",
        { userID }
      );
      setCart(response.data.cartItem.cartProduct);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const removeFromCart = async () => {
    try {
      await axios.post("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/removeFromCart", {
        productId,
        userID,
      });
      showCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/addToCart", {
        productId,
        userID,
      });
      showCart();
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
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
    setBuyPage(true);
    // try {
    //   const {
    //     data: { key },
    //   } = await axios.get("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/key");
    //   const response = await axios.post(
    //     "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/capturePayment",
    //     {
    //       product_id: productId,
    //       userId: userID,
    //       token,
    //     }
    //   );
    //   toast.success("Order id created");

    //   const options = {
    //     key,
    //     amount: response.data.amount,
    //     currency: "INR",
    //     name: "Huehub",
    //     description: "Thank you Purchasing",
    //     image: Logo,
    //     order_id: response.data.orderId,
    //     handler: verifyStatus,
    //     prefill: {
    //       name: user.name,
    //       email: user.email,
    //       contact: user.additionalDetail.contactNumber,
    //     },
    //     notes: {
    //       address: "Razorpay Corporate Office",
    //     },
    //     theme: {
    //       color: "#3399cc",
    //     },
    //   };

    //   const razor = new window.Razorpay(options);
    //   razor.open();
    // } catch (error) {
    //   console.error("Error:", error);
    //   toast.error(error.response.data.message);
    // }
  };

  useEffect(() => {
    fetchItem();
    if (user._id) {
      showCart();
    }
  }, []);

  const imageContainerRef = useRef(null);

  const handleScroll = () => {
    if (imageContainerRef.current) {
      const imageContainer = imageContainerRef.current;
      const scrollableHeight =
        imageContainer.scrollHeight - imageContainer.clientHeight;
      const currentScrollPosition = imageContainer.scrollTop;

      if (
        currentScrollPosition !== 0 &&
        currentScrollPosition !== scrollableHeight
      ) {
        // Do something here if needed
      }
    }
  };

  const productHandler = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gray-300 flex flex-col sm:flex-row relative">
      <div
        ref={imageContainerRef}
        onScroll={handleScroll}
        className=" h-screen w-[70vw] overflow-auto overflow-y-scroll no-scrollbar"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="h-auto rounded-md p-1 mt-5 flex flex-col items-center no-scrollbar justify-center object-cover">
            <img
              className="h-[80vh] w-full object-fill aspect-square px-[1rem] my-1 rounded-md"
              src={selectedImage}
              alt="Selected"
            />
            <div className="flex mt-3">
              {Array.isArray(item.thumbnails) &&
                item.thumbnails.length > 0 &&
                item.thumbnails.map((thumbnail, index) => (
                  <img
                    key={index}
                    className={`max-h-20 max-w-20 px-1 cursor-pointer ${
                      selectedImage === thumbnail
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(thumbnail)}
                  />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center rounded-md min-w-[280px]  relative  top-0 overflow-auto max-w-[480px]">
          <div className="w-fit mt-4 relative flex flex-col sm:max-w-[25rem] xs:max-w-[21rem] bg-white px-[2rem] rounded-md p-1 gap-y-5 font-poppins">
            <div className="absolute -right-3 -top-7">
              <p className=" mt-[1rem] text-xl font-semibold bg-green-500 text-white p-2 rounded-full w-fit">
                ₹ {item.price}
              </p>
            </div>
            <div>
              <p className="font-bold text-3xl font-poppins">
                {item.productName}
              </p>
            </div>
            <div className="text-lg font-semibold ">
              {item.category && <p>Category : {item.category.name}</p>}
            </div>
            <div>
              <p className="text-wrap">{displayText}</p>
            </div>
            <div className="flex mt-[2rem]">
              {cart.some((p) => p._id === item._id) ? (
                <button
                  className="border px-[5%] remove h-[2.5rem] mx-[1rem] w-[11rem] rounded-md  text-white text-sm font-semibold bg-blue-800 "
                  onClick={removeFromCart}
                >
                  Remove Item
                </button>
              ) : (
                <button
                  className="border px-[5%] h-[2.5rem] mx-[1rem] w-[10rem] rounded-md  text-white font-semibold bg-blue-800"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={buyHandler}
                className="border px-[5%] h-[2.5rem] mx-[1rem] w-[10rem] rounded-md  text-white font-semibold bg-blue-800 "
              >
                Buy Now
              </button>
            </div>
            <div>
              {item.seller && (
                <div className="mt-[rem] ">
                  <div
                    onClick={() => checkIfFollowing()}
                    className="flex justify-center items-center bg-amber-300 p-2 gap-x-3 rounded-md my-1 cursor-pointer"
                  >
                    <h1 className=" font-bold text-xl ">Seller :</h1>
                    <div className="flex gap-x-2 items-center">
                      <div className="h-10 w-10 ">
                        <img
                          src={item.seller.image}
                          className=" rounded-full"
                        ></img>
                      </div>
                      <h2 className="font-semibold text-semibold">
                        {item.seller.firstname} {item.seller.lastname}
                      </h2>
                    </div>
                  </div>
                  <button className=" border h-[3rem] w-[17rem] rounded-md shadow  text-white font-semibold bg-blue-600 ">
                    <a href={`https://wa.me/${item.seller.contactNumber}`}>
                      {" "}
                      Message Seller{" "}
                    </a>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-[87%] mt-2 ">
            <Rating user={user} setRating={setRating} />
          </div>
          <div className="ml-[3rem] mt-[6rem] flex flex-col justify-center items-center">
            <div className="flex justify-center">
              <ReactTyped
                strings={["Similar Category Product"]}
                typeSpeed={200}
                backSpeed={50}
                loop
                className="text-3xl text-center bg-black text-white p-1 px-2 rounded-md font-poppins"
              />
            </div>
            <div className="mt-3 w-fit sm:px-2 py-4">
              {posts.length > 0 ? (
                <div className="flex flex-row justify-center item-center">
                  {posts.map((item) => (
                    <ProductImage
                      key={item.id}
                      item={item}
                      onClick={() => productHandler(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-xl ml-[45%] my-[10%]">
                    No Product found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {showSeller && (
          <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-75 flex items-center justify-center">
            <Sellerprofile
              seller={seller}
              user={user}
              isFollowing={isFollowing}
              setIsFollowing={setIsFollowing}
              setShowSeller={setShowSeller}
            />
          </div>
        )}
        {buyPage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <Confirmation user={user} cartItem={cartItem} setBuyPage={setBuyPage} buyPage={buyPage}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Producturl;
