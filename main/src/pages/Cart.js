import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assests/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confirmation from "./Confirmation";
const Cart = ({ user, setTitems ,setCartItems}) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const userID = user._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [cartPage,setCartPage] = useState(false);
  console.log(cartPage);
  useEffect(() => {
    if (cart) setTotalAmount(cart.reduce((acc, curr) => acc + curr.price, 0));
    setTitems(cart.length); // Update total number of items
  }, [cart, setTitems]);

  const showCart = async (e) => {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/displayCartItem",
        { userID }
      );
      console.log(response);
      setCart(response.data.cartItem.cartProduct);
      setCartItems(response.data.cartItem.cartProduct);
      console.log("displaying cart item", cart);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const userId = userID;

  async function verifyStatus(response) {
    try {
      const R_id = response.razorpay_payment_id;
      const R_order = response.razorpay_order_id;
      const R_sign = response.razorpay_signature;
      const res = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/manyVerifySignature",
        { R_id, R_order, R_sign, userId }
      );
      toast.success("Payment successful");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  }

  async function buyHandler() {
    setCartPage(!cartPage);
    // try {
    //   const {
    //     data: { key },
    //   } = await axios.get("https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/key");
    //   const response = await axios.post(
    //     "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/payment/manyCapturePayment",
    //     { totalAmount, userId, token }
    //   );
    //   console.log(key, "printing key");
    //   console.log(response.data);
    //   toast.success("Order ID created");
    //   var options = {
    //     key: key, // Enter the Key ID generated from the Dashboard
    //     amount: response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //     currency: "INR",
    //     name: "Huehub",
    //     description: "Thank you for purchasing",
    //     image: Logo,
    //     order_id: response.data.orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    //     handler: function (response) {
    //       // sentmail();
    //       verifyStatus(response);
    //     },
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

    //   var razor = new window.Razorpay(options);
    //   razor.open();
    // } catch (error) {
    //   console.error("Error:", error);
    //   toast.error(error.response.data.message);
    // }
  }

  useEffect(() => {
    showCart();
  }, []);

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
        cartPage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <Confirmation user={user} cartItem={cart}/>
          </div>
        )
      }
    </div>
  );
};

export default Cart;
