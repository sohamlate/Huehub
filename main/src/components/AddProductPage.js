import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

const Productpage = ({ showAddPage, setShowAddPage }) => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    tags: "",
    Category: "",
    thumbnailImages: [],
  });
  const [catogoryList, setCatogoryList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function changeHandler(event) {
    if (event.target.id === "thumbnailImages") {
      const files = Array.from(event.target.files);
      setFormData((prev) => ({
        ...prev,
        thumbnailImages: files,
      }));

      const fileReaders = [];
      let isCancel = false;
      const newImageUrls = [];

      files.forEach((file) => {
        const reader = new FileReader();
        fileReaders.push(reader);
        reader.onload = (e) => {
          if (isCancel) return;
          newImageUrls.push(e.target.result);
          if (newImageUrls.length === files.length) {
            setImageUrls(newImageUrls);
          }
        };
        reader.readAsDataURL(file);
      });

      return () => {
        isCancel = true;
        fileReaders.forEach((reader) => {
          if (reader.readyState === 1) {
            reader.abort();
          }
        });
      };
    } else {
      setFormData((prev) => ({
        ...prev,
        [event.target.id]: event.target.value,
      }));
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const cat = await axios.get(
          "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getCategoryDetail"
        );
        setCatogoryList(cat.data.allCategory);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("productDescription", formData.productDescription);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("Categorys", formData.Category);
      formData.thumbnailImages.forEach((image) =>
        formDataToSend.append("thumbnailImages", image)
      );

      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/createproduct",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) navigate("/gallary");
      toast.success("Product Inserted Successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white relative border-2 rounded-md p-1 font-poppins shadow-md shadow-black"
    >
      <div
        onClick={() => setShowAddPage(!showAddPage)}
        className="bg-red-600 w-fit p-1 text-white rounded-full absolute -right-2 -top-2 hover:scale-110 hover:bg-red-700"
      >
        <RxCross2 />
      </div>
      <div className="flex gap-x-3">
        <div className="border-2 rounded-md ml-3 mt-3 min-w-[20vw]">
          <input
            id="thumbnailImages"
            type="file"
            accept="image/*"
            multiple
            onChange={changeHandler}
            style={{ display: "none" }}
          />
          <label htmlFor="thumbnailImages" className="cursor-pointer blink">
            Select Images
          </label>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} className="mt-0 p-1 max-w-[30rem]" />
          ))}
        </div>

        <div>
          <input
            className="font-bold text-3xl mt-[3rem] w-full rounded-md px-2 focus:outline-none"
            type="text"
            id="productName"
            placeholder="Please Enter The Title"
            value={formData.productName}
            onChange={changeHandler}
          />

          <input
            className="mt-[3rem] w-full rounded-md h-[3rem] font-semibold block text-xl whitespace-normal focus:outline-none"
            placeholder="Enter Description"
            id="productDescription"
            value={formData.productDescription}
            onChange={changeHandler}
          />

          <input
            className="mt-[1rem] font-semibold rounded-md w-full text-xl focus:outline-none"
            placeholder="Enter Price"
            id="price"
            type="number"
            value={formData.price}
            onChange={changeHandler}
          />

          <input
            className="mt-[1.5rem] font-semibold w-full rounded-md text-xl focus:outline-none block"
            placeholder="Enter Tags"
            id="tags"
            value={formData.tags}
            onChange={changeHandler}
          />

          <div className="mt-[3rem]">
            <label htmlFor="Category" className="mx-[1rem] font-bold">
              Select a Category:
            </label>
            <select id="Category" onChange={changeHandler}>
              <option>Select Category</option>
              {catogoryList.map((ele) => (
                <option key={ele._id} value={JSON.stringify(ele)}>
                  {ele.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button onClick={submitHandler} className="left-1/2 ml-[50%] mt-[3%] border-2 bg-blue-600 py-2 px-[3rem] text-white font-semibold">
        Submit
      </button>
    </form>
  );
};

export default Productpage;
