import React, { useState, useEffect } from "react";
import axios from "axios";

const ShippingInfo = ({ user, formData, setFormData }) => {
  console.log(user);

  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const fetchAdditionalDetails = async () => {
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/profile/getUserData",
        { userId: user._id }
      );
      console.log(response);
      return response.data.userDetail.additionalDetail;
    } catch (error) {
      console.error("Error fetching additional details:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeFormData = async () => {
      let initialFormData = {
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
        mobileNumber: "",
      };

      if (user?.additionalDetail) {
        const additionalDetails = await fetchAdditionalDetails();
        console.log(additionalDetails);
        if (
          additionalDetails &&
          additionalDetails.address &&
          additionalDetails.address.length > 0
        ) {
          const address = additionalDetails.address[0];
          initialFormData = {
            ...initialFormData,
            address: address.street || "",
            pincode: address.postalCode || "",
            city: address.city || "",
            state: address.state || "",
            country: address.country || "",
            mobileNumber: additionalDetails.contactNumber || "",
          };
          console.log("321231", initialFormData);
        }
      }

      const savedFormData = localStorage.getItem("formData");
      const parsedFormData = savedFormData
        ? JSON.parse(savedFormData)
        : initialFormData;
      setFormData(parsedFormData);
      setInitialFormData(parsedFormData);
      setLoading(false);
    };

    initializeFormData();
  }, [user, setFormData]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData, loading]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("formData");
    };
  }, []);

  useEffect(() => {
    if (initialFormData) {
      setIsFormChanged(JSON.stringify(initialFormData) !== JSON.stringify(formData));
    }
  }, [formData, initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/order/saveAddress",
        {
          userId: user._id,
          address: formData.address,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }
      );
      console.log("1231554", response);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <form
        className="font-poppins flex flex-col gap-y-4 mb-2"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-x-4 w-full">
          <div className="w-full">
            <label className="block">First Name</label>
            <input
              name="firstname"
              type="text"
              className="mt-1 block h-10 w-full border px-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="block">Last Name</label>
            <input
              name="lastname"
              type="text"
              className="mt-1 block w-full h-10 border px-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="left-0">Address</label>
          <div>
            <input
              name="address"
              placeholder="Street Or Area"
              className="p-1 w-full h-10 rounded-md border"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 flex justify-between gap-x-3">
            <input
              name="pincode"
              placeholder="Pincode"
              type="number"
              className="no-spinner p-1 w-[47%] h-10 rounded-md border"
              value={formData.pincode}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              type="text"
              className="p-1 w-[47%] h-10 rounded-md border"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 flex justify-between gap-x-3">
            <input
              name="state"
              placeholder="State"
              type="text"
              className="p-1 w-[47%] h-10 rounded-md border"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              name="country"
              placeholder="Country"
              type="text"
              className="p-1 w-[47%] h-10 rounded-md border"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="">
          <div>
            <label className="  ">Mobile Number</label>
            <input
              name="mobileNumber"
              type="number"
              className="no-spinner mt-1 px-2 block h-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        {isFormChanged && (
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className=" mt-4 w-fit p-2 h-10 bg-blue-500 text-white rounded-md focus:ring-blue-700 focus:ring-2 focus:ring-opacity-50"
            >
              Save Address
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShippingInfo;
