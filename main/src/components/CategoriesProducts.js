import react from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const CategoriesProducts = ({ item }) => {
  // console.log(item);

  const navigate = useNavigate();
  const [formData, setFormData] = useState();
  console.log(item, "fdsf");
 
  const categoryHandler = async (item) => {
    try {
      const itemID = item._id;
      //         console.log("hwqeqwewqeweqwew",formData);
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getCategoryPageDetail",
        { itemID }
      );
      const item1 = response.data.data.selectedCategory.products;
          // console.log('Response:',item1);
      const statedata = {
        item1: item1,
        item: item,
      };
      navigate("/catproduct", { state: statedata });
    } catch (error) {
      console.log("Error:", error);
    }


    //navigate(`/category/${id}`);
  };
  return (
    <div className="flex justify-center ">
      <div
        onClick={() => categoryHandler(item)}
        className=" bg-white   h-fit shadow mb-[3rem] p-2 rounded-[9%] hover:scale-105 transition-all duration-300 hover:shadow-slate-400 sm:w-[15rem] sm:h-[19rem] xs:w-[10rem] xs:h-[15rem]"
      >
        <img
          className="sm:w-[18rem] sm:h-[16rem] xs:h-[12rem] xs:w-[10rem] rounded-[9%]"
          src={item.image}
          alt="prints"
        ></img>
        <p className="text-center mt-[0.5rem]">{item.name}</p>
      </div>
    </div>
  );
};

export default CategoriesProducts;
