import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo1.png";
import {
  FaChartLine,
  FaUsers,
  FaUserPlus,
  FaList,
  FaHome,
  FaBars,
} from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { BsSunglasses } from "react-icons/bs";

const Navbar = () => {
  return (
    <div>
      
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-12 py-4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-50 border-b border-gray-300">
        
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto drop-shadow-lg" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide"></h1>
        </div>

        {/* Mobile menu button (only visible on small screens) */}
        <div className="md:hidden flex  items-center gap-5">
        <NavLink
            className="text-gray-800 hover:text-blue-600   focus:outline-none"
            to="/Addcustomer"
          >
            <FaUserPlus className="text-xl ml-7" />
            <span className="text-xs ">Add Customer</span>
          </NavLink>

          <NavLink
            className="text-gray-800 hover:text-blue-600   focus:outline-none"
            to="/MonthlySales"
          >
            <SlCalender className="text-xl ml-5" />
            <span className="text-xs ">MonthlySales</span>
          </NavLink>
          
          <NavLink
            className="text-gray-800 hover:text-blue-600   focus:outline-none"
            to="/stock"
          >
            <FaCubesStacked className="text-xl ml-1" />
            <span className="text-xs ">stock</span>
          </NavLink>
        </div>

        <div className="hidden md:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-blue-600" : "hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/daily-sales"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-blue-600" : "hover:text-blue-600"
              }`
            }
          >
            Daily Sales
          </NavLink>
          <NavLink
            to="/AddWholesaler"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-green-600" : "hover:text-green-600"
              }`
            }
          >
            Wholesaler
          </NavLink>
          <NavLink
            to="/MonthlySales"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-indigo-600" : "hover:text-indigo-600"
              }`
            }
          >
            Monthly Sales
          </NavLink>
          <NavLink
            to="/WholesalerList"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-purple-600" : "hover:text-purple-600"
              }`
            }
          >
            Wholesaler List
          </NavLink>
          <NavLink
            to="/Addcustomer"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-red-600" : "hover:text-red-600"
              }`
            }
          >
            Add Customer
          </NavLink>
          <NavLink
            to="/CustomerList"
            className={({ isActive }) =>
              `text-gray-800 px-5 py-2 text-lg font-medium transition ${
                isActive ? "text-yellow-600" : "hover:text-yellow-600"
              }`
            }
          >
            Customers
          </NavLink>
        </div>
      </nav>

      {/* Bottom Navbar (Mobile) */}
      <div className="fixed bottom-0 w-full flex justify-around items-center bg-white py-3 shadow-lg md:hidden z-50 border-t border-gray-300">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-blue-600" : "hover:text-blue-600"
            }`
          }
        >
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/daily-sales"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-blue-600" : "hover:text-blue-600"
            }`
          }
        >
          <FaChartLine className="text-xl" />
          <span className="text-xs">Sales</span>
        </NavLink>
        <NavLink
          to="/AddWholesaler"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-green-600" : "hover:text-green-600"
            }`
          }
        >
          <BsSunglasses className="text-xl" />
          <span className="text-xs">Wholesaler</span>
        </NavLink>
        <NavLink
          to="/CustomerList"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-red-600" : "hover:text-red-600"
            }`
          }
        >
          <FaUsers className="text-xl" />
          <span className="text-xs">Customers</span>
        </NavLink>
        <NavLink
          to="/WholesalerList"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-purple-600" : "hover:text-purple-600"
            }`
          }
        >
          <FaList className="text-xl" />
          <span className="text-xs">List</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
