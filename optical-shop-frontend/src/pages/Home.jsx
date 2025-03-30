import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png"; // Optical Logo 

const Home = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-12 py-4 bg-white bg-opacity-80 backdrop-blur-md shadow-lg z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow-md" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-wide">
            Shree Vinayak Optical
          </h1>
        </div>
        <div className="flex gap-4 md:gap-6">
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-blue-600 transition"
            onClick={() => navigate("/daily-sales")}
          >
             Daily Sales
          </button>
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-green-600 transition"
            onClick={() => navigate("/AddWholesaler")}
          >
             Wholesaler
          </button>
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-indigo-600 transition"
            onClick={() => navigate("/MonthlySales")}
          >
             Monthly Sales
          </button>
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-purple-600 transition"
            onClick={() => navigate("/WholesalerList")}
          >
             Wholesaler List
          </button>
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-purple-600 transition"
            onClick={() => navigate("/Addcustomer")}
          >
             Add Customer
          </button>
          <button
            className="text-gray-800 px-4 py-2 text-sm md:text-base hover:text-purple-600 transition"
            onClick={() => navigate("/CustomerList")}
          >
             Customers
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg shadow-md hover:bg-red-600 transition"
          onClick={() => navigate("/")}
        >
           Logout
        </button>
      </nav>

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-16 w-40 h-40 bg-blue-400 blur-3xl opacity-15 animate-floating"></div>
        <div className="absolute bottom-20 right-20 w-52 h-52 bg-purple-400 blur-3xl opacity-20 animate-floating-reverse"></div>
      </div>

      {/* Center Content - 3D Logo */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 mt-12">
        <div className="relative">
          <img
            src={logo}
            alt="3D Optical Logo"
            className="w-52 md:w-64 transform transition-transform duration-300"
            style={{ transform: `rotateY(${rotation}deg)` }}
            onMouseEnter={() => setRotation(20)}
            onMouseLeave={() => setRotation(0)}
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 drop-shadow-md">
          👓 Welcome to shree vinayak otical
        </h1>
        <p className="text-md md:text-lg text-gray-600 mt-3 max-w-2xl text-center">
          Manage your inventory, track sales, and streamline your orders effortlessly.
        </p>
      </div>
    </div>
  );
};

export default Home;
