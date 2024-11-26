import React from "react";
import { useEffect, useState,Suspense } from "react";
import Products from "../components/Products";
import Spinner from "../components/Spinner";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";


const CatProductPage = ({user}) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
   const [isLiked, setIsLiked] = useState(false);
  const postsPerPage = 8;


  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  //    const statedata = location.state || {};
  const item = state.item;
  //   console.log("in product",state);
  async function fetchProductData() {
    setLoading(true);
    try {
      setPosts(state.item1);
      console.log("6+2651265165151", posts);
    } catch (error) {
      console.log("error in gallary");
      setPosts([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //  console.log("fdscvdsv",posts);

  return (
    <div className="bg-gradient-to-br from-sky-200 to-white">
      <h1 className="font-bold text-xl ml-[44%] pt-[2rem] mb-[2rem] ">
        Category : {item.name}
      </h1>

      <div className="flex flex-row rounded-3xl border-2 justify-center mx-[25%] mb-[3rem] py-[0.5rem] boder-2 border-black">
        <input
          className="w-[90%] py-[0.3rem] border-none bg-inherit focus:border-none focus:outline-none"
          type="text"
          placeholder="Explore your passion: Search for your favorite art style or artist here..."
          // value=""
        ></input>
        <div className="pt-2 text-xl">
          <CiSearch />
        </div>
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
  );
};

export default CatProductPage;
