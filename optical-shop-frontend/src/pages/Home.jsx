import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaUsers, FaUserPlus, FaList, FaHome } from "react-icons/fa";
import logo from "../assets/logo1.png"; 

const Home = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);

  return (
    <>
    <div className="relative min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 overflow-hidden">
    
      {/* Navbar */}
      {/* Mobile Navbar */}
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-16 w-40 h-40 bg-blue-400 blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-52 h-52 bg-purple-400 blur-3xl opacity-30 animate-bounce"></div>
      </div>

      {/* Center Content - 3D Logo */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 mt-20">
        <div className="relative">
          <img
            src={logo}
            alt="3D Optical Logo"
            className="w-56 md:w-72 transform transition-transform duration-500 hover:rotate-6 hover:scale-110"
            onMouseEnter={() => setRotation(20)}
            onMouseLeave={() => setRotation(0)}
            style={{ transform: `rotateY(${rotation}deg)` }}
          />
        </div>
        <h1 className="text-1xl md:text-5xl font-extrabold text-gray-900 mt-6 drop-shadow-lg">
          👓 Welcome to Shree Vinayak Optical
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-3xl text-center leading-relaxed">
          Manage your inventory, track sales, and streamline your orders effortlessly.
        </p>
      </div>
    </div>
    </>
  );
};

export default Home;