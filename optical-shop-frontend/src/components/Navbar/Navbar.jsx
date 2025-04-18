import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo1.png";
import {
  FaChartLine,
  FaUsers,
  FaUserPlus,
  FaHome,
  FaChevronDown,
} from "react-icons/fa";
import { FaCubesStacked } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { BsSunglasses } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi2";

const Navbar = () => {
  return (
    <div>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 lg:px-12 py-3 bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow-lg" />
          <h1 className="text-xl font-bold text-gray-800">Shree Vinayak Optical</h1>
        </div>

        {/* Mobile menu icons (only visible on small screens) */}
        <div className="md:hidden flex items-center gap-5">
          <NavLink
            className="flex flex-col items-center text-gray-800 hover:text-blue-600"
            to="/MonthlySales"
          >
            <SlCalender className="text-xl" />
            <span className="text-xs">Monthly</span>
          </NavLink>
          
          <NavLink
            className="flex flex-col items-center text-gray-800 hover:text-blue-600"
            to="/Stock"
          >
            <FaCubesStacked className="text-xl" />
            <span className="text-xs">Stock</span>
          </NavLink>
          <NavLink
            className="flex flex-col items-center text-gray-800 hover:text-blue-600"
            to="/bill"
          >
            <HiOutlineNewspaper className="text-2xl" />
            <span className="text-xs">bill</span>
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg transition ${
                isActive ? "text-blue-600 bg-blue-50" : "hover:text-blue-600 hover:bg-gray-50"
              }`
            }
          >
            <FaHome className="text-lg" />
            Home
          </NavLink>
          
          {/* change */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:text-blue-600 hover:bg-gray-50">
              <FaChartLine className="text-lg" />
              Daily Sales
              <FaChevronDown className="text-xs mt-1" />
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 min-w-[200px] z-10 border border-gray-100">
              <NavLink
                to="/daily-sales"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Add Sales
              </NavLink>
              <NavLink
                to="/bill"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
               Print bill
              </NavLink>
            </div>
          </div>
          
          <div className="group relative">
            <button className="flex items-center gap-1 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:text-blue-600 hover:bg-gray-50">
              <FaCubesStacked className="text-lg" />
              Inventory
              <FaChevronDown className="text-xs mt-1" />
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 min-w-[200px] z-10 border border-gray-100">
              <NavLink
                to="/Stock"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Stock Management
              </NavLink>
              <NavLink
                to="/MonthlySales"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Monthly Reports
              </NavLink>
            </div>
          </div>
          
          <div className="group relative">
            <button className="flex items-center gap-1 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:text-blue-600 hover:bg-gray-50">
              <FaUsers className="text-lg" />
              Customers
              <FaChevronDown className="text-xs mt-1" />
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 min-w-[200px] z-10 border border-gray-100">
              <NavLink
                to="/CustomerList"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Customer List
              </NavLink>
              <NavLink
                to="/Addcustomer"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-md ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Add Customer
              </NavLink>
            </div>
          </div>
          
          <NavLink
            to="/AddWholesaler"
            className={({ isActive }) =>
              `flex items-center gap-1 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg transition ${
                isActive ? "text-green-600 bg-green-50" : "hover:text-green-600 hover:bg-gray-50"
              }`
            }
          >
            <BsSunglasses className="text-lg" />
            Wholesalers
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
          <span className="text-xs">Daily Sales</span>
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
          to="/Addcustomer"
          className={({ isActive }) =>
            `flex flex-col items-center text-gray-600 ${
              isActive ? "text-red-600" : "hover:text-red-600"
            }`
          }
        >
          <FaUserPlus className="text-xl" />
          <span className="text-xs">Add Customer</span>
        </NavLink>
        
      </div>
    </div>
  );
};

export default Navbar;