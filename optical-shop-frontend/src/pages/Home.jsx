import React, { useState } from "react";
import logo from "../assets/logo1.png";

const Home = () => {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 text-center">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-4 sm:left-16 w-24 sm:w-40 h-24 sm:h-40 bg-blue-400 blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute bottom-16 right-6 sm:right-20 w-28 sm:w-52 h-28 sm:h-52 bg-purple-400 blur-3xl opacity-30 animate-bounce"></div>
      </div>

      {/* Center Content - 3D Logo */}
      <div className="relative z-10">
        <img
          src={logo}
          alt="3D Optical Logo"
          className="w-32 sm:w-48 md:w-64 transform transition-transform duration-500 hover:rotate-6 hover:scale-110"
          onMouseEnter={() => setRotation(20)}
          onMouseLeave={() => setRotation(0)}
          style={{ transform: `rotateY(${rotation}deg)` }}
        />
      </div>
      <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mt-6 drop-shadow-lg">
        👓 Welcome to Shree Vinayak Optical
      </h1>
      <p className="text-sm sm:text-lg md:text-xl text-gray-700 mt-4 max-w-xs sm:max-w-xl md:max-w-3xl leading-relaxed">
        Manage your inventory, track sales, and streamline your orders effortlessly.
      </p>
    </div>
  );
};

export default Home;