import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assests/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confirmation from "./Confirmation";
const Cart = ({ user, setTitems ,setCartItems,cartItem,titems}) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const userID = user._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [buyPage,setBuyPage] = useState(false);
  const [cartBuy  , setCartBuy] = useState(false);
  
console.log(cart,"jfdhugifdhgouhfgiutuhijd");

  useEffect(() => {
    if (cart) setTotalAmount(cart.reduce((acc, curr) => acc +( curr.productId.price * curr.quantity), 0));
      setTitems(cart.length);
  }, [cart, setTitems]);

  const showCart = async (e) => {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/displayCartItem",
        { userID }
      );
      setCart(response.data.cartItem);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const userId = userID;

  async function buyHandler() {
    setBuyPage(!buyPage);
  }

  useEffect(() => {
    showCart();
  }, [user]);

  return (
    <div className=" bg-gray-300 h-full">
      <h1 className="ml-[3.5rem] mb-[1rem] font-bold text-xl">
        Your Shopping Basket
      </h1>
      <div className="ml-[3rem] flex ">
        {cart && cart.length > 0 ? (
          <div className="flex items-center justify-center ">
            <div className="flex flex-col gap-4  my-4  p-2 rounded-md">
              {cart.map((item, index) => {
                return (
                  <CartItem
                    item={item}
                    key={item.id}
                    itemIndex={index}
                    userID={userID}
                    showCart={showCart}
                    user={user}
                    cart = {cart}
                  />
                );
              })}
            </div>
            <div className="fixed top-[35%] right-2 bg-white rounded-md w-[22vw]  flex flex-col p-4 font-poppins">
              <div className="text-center text-lg font-bold">Order Summary</div>
              <div className=" bg-gray-300  h-0.5"></div>
            
              <div className="flex flex-col gap-y-4 my-4">
                <div className="flex justify-between">
                  <p className="">Total Items: </p><span className=" text-right">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <p className="">Shipping Charges : </p><span className=" text-right">Rs 0</span>
                </div>
                <div className="flex justify-between bg-orange-200 p-1 rounded-md border border-orange-700"> 
                  <p className="font-bold">Total Amount :</p> <span>₹ {totalAmount}</span>
                </div>
              </div>
              <button
                onClick={buyHandler}
                className="border text-white mx-20 rounded-md p-2 bg-blue-600 hover:shadow-white"
              >
                Check Out
              </button>
            </div>
          </div>
        ) : (
          <div className="font-bold h-[100vh] flex flex-col gap-6 justify-center items-center">
            <h1>Cart Empty</h1>
            <Link to="/gallery">
              <button>Shop Now </button>
            </Link>
          </div>
        )}
      </div>
      {
        buyPage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <Confirmation user={user} cartItem={cart} setBuyPage= {setBuyPage} cartBuy={!cartBuy} setCartBuy={setCartBuy}/>
          </div>
        )
      }
    </div>
  );
};

export default Cart;
