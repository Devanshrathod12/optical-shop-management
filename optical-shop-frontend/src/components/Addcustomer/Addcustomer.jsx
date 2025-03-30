import React, { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    contactNo: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      console.log("Customer Data:", customer);
      await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/custo/add`, customer);
      toast.success("Customer Data Added");
      setCustomer({ name: "", contactNo: "", address: "" }); // ✅ Fix
    } catch (error) {
      toast.error("Error adding Customer Data");
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Customer Data</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
       
      </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 font-medium">Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={customer.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Number Input */}
          <div>
            <label className="block text-gray-700 font-medium">Contact Number</label>
            <input
              type="tel"
              name="contactNo"
              placeholder="Enter contact number"
              value={customer.contactNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
  type="text"
  name="address"
  placeholder="Enter address"
  value={customer.address}
  onChange={handleChange}
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  required
/>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
