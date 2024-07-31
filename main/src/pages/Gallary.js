import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";
import debounce from "lodash.debounce";

const Products = React.lazy(() => import("../components/Products"));
const Spinner = React.lazy(() => import("../components/Spinner"));

const Gallary = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [formData, setFormData] = useState({ Category: "" });
  const [categoryList, setCategoryList] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 8;

  function changeHandler(event) {
    const { id, value, checked } = event.target;
    //console.log(event.target.value);
    // console.log(id,value,checked);
    if (id === "Category") {
      const category = JSON.parse(value);
      setSelectedCategories((prev) =>
        checked ? [...prev, category] : prev.filter((cat) => cat._id !== category._id)
      );
    } else if (id === "Price") {
      setSelectedPriceRange(value);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const cat = await axios.get(
          "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getCategoryDetail"
        );
        setCategoryList(cat.data.allCategory);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetch();
  }, []);

  const categoryHandler = async (selectedCategories) => {
    try {
      const itemID = selectedCategories.map((cat) => cat._id);
      // console.log(categoryIds);
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getCategoryPageDetailArray",
        { itemID }
      );
      const selectedCat = response.data.data.selectedCategory;

     
      const allProducts = selectedCat.reduce((acc, category) => {
        return acc.concat(category.products);
      }, []);

      console.log(allProducts);
 
      return allProducts;
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  async function fetchProductData() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/product/getallproduct"
      );
      setOriginalPosts(res.data.data);
      setPosts(res.data.data);
    } catch (error) {
      console.log("error in gallary");
      toast.error(error.response.data.message);
      setPosts([]);
    }
    setLoading(false);
  }

  const applyFilters = async () => {
    let filteredPosts = [...originalPosts];

    if (selectedCategories.length > 0) {
      filteredPosts = await categoryHandler(selectedCategories);
    }

    if (selectedPriceRange !== "All") {
      const price = parseInt(selectedPriceRange);
      filteredPosts = filteredPosts.filter((post) => post.price <= price);
    }

    setPosts(filteredPosts);
    setCurrentPage(1); // Reset to first page whenever filters are applied
  };

  useEffect(() => {
    applyFilters();
  }, [selectedPriceRange, selectedCategories]);

  useEffect(() => {
    fetchProductData();
  }, []);

  // Debounced search handler
  const debouncedSearch = debounce((term) => {
    const filteredPosts = originalPosts.filter((post) =>
      post.productName.toLowerCase().includes(term.toLowerCase())
    );
    setPosts(filteredPosts);
    setCurrentPage(1); // Reset to first page whenever search term changes
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    // Cancel the debounced function on cleanup
    return () => debouncedSearch.cancel();
  }, [searchTerm, originalPosts]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="bg-gray-300 h-screen overflow-y-auto pt-[2rem] pb-[2rem]">
      <h1 className="font-bold text-xl xs:ml-[32%] xs1:ml-[37%] sm:ml-[45%] mb-[2rem]">
        Product Gallery
      </h1>

      <div className="flex flex-row rounded-3xl border-2 justify-center xs:mx-[5%] sm:mx-[25%] mb-[3rem] py-[0.5rem] boder-2 border-black min-w-[280px]">
        <input
          onChange={handleSearchChange}
          className="w-[90%] bg-inherit text-black py-[0.3rem] border-none focus:outline-none min-w-[280px]"
          type="text"
          placeholder="Explore your passion: Search for your favorite art style or artist here..."
        ></input>
        <div className="pt-2 text-xl">
          <CiSearch />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex ">
          <div className="hidden md:block w-[20vw] bg-white mx-5 rounded-md">
            <div className="flex justify-between items-center font-poppins">
              <div className="bg-blue-700 text-white p-2 m-2 rounded-md text-lg">
                <p>Filter</p>
              </div>
              <div
                className="text-blue-400 mx-5 cursor-pointer"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedPriceRange("All");
                  fetchProductData();
                }}
              >
                Clean All
              </div>
            </div>
            <div className="bg-gray-300 h-0.5 w-full mx-0.5"></div>
            <div className="">
              <label
                htmlFor="category"
                className="mx-[1rem] font-poppins text-xl font-bold"
              >
                Select Categories:
              </label>
              <div className="flex flex-col gap-y-2 justify-start mx-3 my-3 font-poppins ">
                {categoryList &&
                  categoryList.map((ele) => (
                    <div key={ele._id} className="flex items-center p-2 text-lg bg-gray-100">
                      <input
                        className=""
                        type="checkbox"
                        id="Category"
                        value={JSON.stringify(ele)}
                        onChange={changeHandler}
                        checked={selectedCategories.some(
                          (cat) => cat._id === ele._id
                        )}
                      />
                      <label className="ml-2">{ele.name}</label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[70vw] no-scrollbar">
            <div className="my-2 rounded-md py-3 bg-white h-[20] ">
              <label
                htmlFor="Price"
                className="mx-[1rem] font-poppins text-xl font-bold"
              >
                Sort By Price:
              </label>
              <select
                id="Price"
                className=" focus:outline-none rounded-md px-1 h-8"
                onChange={changeHandler}
                value={selectedPriceRange}
              >
                <option className="focus:outline-none">All</option>
                <option value="500">Below 500</option>
                <option value="5000">Below 5000</option>
                <option value="10000">Below 10000</option>
                <option value="20000">Below 20000</option>
              </select>
            </div>
            {loading ? (
              <Suspense fallback={<Spinner />}>
                <Spinner />
              </Suspense>
            ) : posts.length > 0 ? (
              <Stack spacing={2} className="no-scrollbar">
                <div className="no-scrollbar flex flex-col justify-center items-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white rounded-md hscroll gap-y-3 gap-x-3 p-5">
                  {currentPosts.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="basis-1/4 grow no-scrollbar"
                    >
                   
                     {<Suspense fallback={<div>Loading...</div>}>
                        <Products
                          item={item}
                          user={user}
                          isLiked={user.length > 0 && user.likedProducts.includes(item._id)}
                          setIsLiked={setIsLiked}
                        />
                      </Suspense>}
                    </motion.div>
                  ))}
                </div>
                <Pagination
                  count={Math.ceil(posts.length / postsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  className="flex justify-center"
                />
              </Stack>
            ) : (
              <div>
                <p className="font-semibold text-xl">No Product found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallary;
