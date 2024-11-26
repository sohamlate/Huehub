import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Profile from "../components/Profile";
import Menu from "../components/Menu";
import CartHover from "./CartHover";
import axios from "axios";
import LikedHover from "./LikedHover";

const Navbar = ({ isLoggedIn,setIsLoggedIn,user,setUser,titems,cartItems,setTitems}) => {

  const [cartItem ,setCartItems]= useState();
  const [isclick, setIsClick] = useState(false);
  const [ismenu, setismenu] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isHover2, setIsHover2] = useState(false);
  const [ondislike,setOndislike] = useState();
  const cartHoverRef = useRef(null);
  const liked = user && Array.isArray(user.likedProducts) ? user.likedProducts : [];
  
  
  const showCart = async (e) => {
    try {
      const userID = user?._id;
      console.log(userID,"prinrint se");
        const response = await axios.post(
          "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/displayCartItem",
          { userID }
        );
        console.log(response,"dsafaffsdf");
        setCartItems(response.data.cartItem);
      } catch (error) {
        console.error("Error:", error);
      }
    };


  useEffect(() => {
    showCart();
  }, [user]);

  useEffect(() => {
    if(cartItem)
    setTitems(cartItem.length);
  }, [cartItem]);
  


  useEffect(() => {
  
    const handleDocumentClick = (event) => {
      if (
        cartHoverRef.current &&
        !cartHoverRef.current.contains(event.target)
      ) {
        setIsHover(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <nav className="border-gray-200 navbar m-2 rounded-md font-poppins">
      <div className="max-w-screen-xl flex flex-wrap justify-between items-center mx-auto">
        {/* Logo and menu button */}
        <div className="left-0">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://res.cloudinary.com/dsy3ebkqc/image/upload/v1712813661/image-removebg-preview_2_z62obq.png"
              className="w-[13rem]"
              alt="Huehub Logo"
            />
          </a>
        </div>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            onClick={() => setismenu(!ismenu)}
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
          <div className="absolute left-1 z-50 mt-[34rem] text-center">
            {ismenu && (
              <Menu
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                setismenu={setismenu}
                ismenu={ismenu}
              />
            )}
          </div>
        </button>
        {/* Navigation Links */}
        <div
          className="w-[50vw] hidden md:flex justify-evenly items-center "
          id="navbar-default"
        >
          <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
            <NavLink to="/">Home</NavLink>
          </div>
          <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
            <NavLink to="/gallery">Gallery</NavLink>
          </div>
          <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
            <NavLink to="/about">About</NavLink>
          </div>
          <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
            <NavLink to="/contact">Contact</NavLink>
          </div>
          {user._id && user?.accountType === "Seller" && (
            <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
              <NavLink to="/sellerpage">Sell</NavLink>
            </div>
          )}
          {user._id && user?.accountType !== "Seller" && (
            <div className="text-xl text-white font-bold hover:border-b-2 transition-all duration-100 hover:text-yellow-300 border-yellow-300 cursor-pointer">
              <NavLink to="/becomeseller">Become a Seller</NavLink>
            </div>
          )}
        </div>
        {/* User and Cart Controls */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <div className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse">
            {!isLoggedIn && (
              <div>
                <NavLink to="/login">Login</NavLink>
              </div>
            )}
            {!isLoggedIn && (
              <div>
                <NavLink to="/otp">
                  <button>Sign Up</button>
                </NavLink>
              </div>
            )}
            <div className="flex justify-end items-center gap-x-5">
              <div
                onClick={() => setIsHover2(!isHover2)}
                className="text-white text-2xl relative"
              >
                <FaRegHeart />
                {isHover2 && (
                  <div
                    ref={cartHoverRef}
                    className="absolute right-0 mt-2 w-[280px] bg-pink-200 border border-gray-200 rounded-lg shadow-lg z-40"
                  >
                    <div className="flex justify-between items-center text-rose-400 text-base mx-2 p-2">
                      <p>Liked Products</p>
                      <p>{liked && liked.length}</p>
                    </div>
                    {liked.length > 0 ? (
                      <div className="p-4">
                        {liked.map((item) => (
                          <LikedHover key={item} item={item} user={user} ondislike={ondislike} setOndislike={setOndislike}/>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-gray-500">
                          There are no liked products
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <div
                  className="relative"
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  <NavLink to="/cart">
                    <FaCartShopping className="text-2xl text-white" />
                    <div className="absolute text-xs -top-2 -right-2 z-30">
                      <p className="bg-green-400 text-white p-1 rounded-full">
                        {titems}
                      </p>
                    </div>
                  </NavLink>
                  {isHover && (
                    <div
                      ref={cartHoverRef}
                      className="absolute right-0 mt-2 w-[280px] bg-orange-100 border border-gray-200 rounded-lg shadow-lg z-40"
                    >
                      <div className="flex justify-between items-center mt-2">
                        <p className="p-1 text-amber-600 mx-2">My Cart</p>
                        <p className="p-1 text-amber-600 mx-2">
                          {cartItem && cartItem.length} items
                        </p>
                      </div>
                      {cartItem && cartItem.length > 0 ? (
                        <div className="p-4">
                          {cartItem.map((item) => (
                            <CartHover key={item.productId.id} item={item.productId} user={user} />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4">
                          <p className="text-sm text-gray-500">
                            Your cart is empty.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {isLoggedIn && (
                  <div className="relative">
                    <img
                      onClick={() => setIsClick(!isclick)}
                      className="w-[2rem] h-[2rem] rounded-full"
                      src={user.image}
                      alt="Profile"
                    />
                    <div className="absolute right-0 z-50">
                      {isclick && (
                        <Profile
                          user={user}
                          setUser={setUser}
                          setIsLoggedIn={setIsLoggedIn}
                          isLoggedIn={isLoggedIn}
                          setIsClick={setIsClick}
                          isclick={isclick}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
