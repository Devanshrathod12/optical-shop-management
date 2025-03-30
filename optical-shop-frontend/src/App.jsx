import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DailySales from "./components/DailySales/DailySales";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddWholesaler from "./components/AddWholesaler/AddWholesaler";
import WholesalerList from "./components/WholesalerList/WholesalerList";
import MonthlySales from "./components/MonthlySales/MonthlySales";
import AddCustomer from "./components/Addcustomer/Addcustomer";
import CustomerList from "./components/CustomerList/CustomerList";
import Navbar from "./components/Navbar/Navbar";
import InstallButton from "./components/install/InstallButton";
import moment from "moment";

function App() {
  return (
    <Router>
      {/* Navbar को Router के अंदर लाएं */}
      <Navbar />
      <InstallButton />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-sales" element={<DailySales />} />
        <Route path="/AddWholesaler" element={<AddWholesaler />} />
        <Route path="/WholesalerList" element={<WholesalerList />} />
        <Route path="/MonthlySales" element={<MonthlySales />} />
        <Route path="/Addcustomer" element={<AddCustomer />} />
        <Route path="/CustomerList" element={<CustomerList />} />
      </Routes>
    </Router>
  );
}

export default App;
