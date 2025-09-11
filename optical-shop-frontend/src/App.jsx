import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./components/context/AuthContext";
import ProtectedRoute from "./components/Routes/ProtectedRoute";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import DailySales from "./components/DailySales/DailySales";
import AddWholesaler from "./components/AddWholesaler/AddWholesaler";
import MonthlySales from "./components/MonthlySales/MonthlySales";
import AddCustomer from "./components/Addcustomer/Addcustomer";
import CustomerList from "./components/CustomerList/CustomerList";
import Navbar from "./components/Navbar/Navbar";
import InstallButton from "./components/install/InstallButton";
import Stock from "./components/stock/Stock";
import SendSMS from "./components/SMS/SendSMS";
import PrescriptionBillGenerator from "./components/BillPrint/PrescriptionBillGenerator";
import NotificationForOldCustomer from "./components/NotificationForOldCutomer/NotificationForOldCutomer";


const AppLayout = () => {
  const { token } = useAuth();
  if (!token) return null; // Agar logged in nahi hai, to kuch mat dikhao

  return (
    <>
      <Navbar />
      <InstallButton />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/daily-sales" element={<DailySales />} />
            <Route path="/AddWholesaler" element={<AddWholesaler />} />
            <Route path="/MonthlySales" element={<MonthlySales />} />
            <Route path="/Addcustomer" element={<AddCustomer />} />
            <Route path="/CustomerList" element={<CustomerList />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/SendSMS" element={<SendSMS />} />
            <Route path="/bill" element={<PrescriptionBillGenerator />} />
            <Route path="/notification" element={<NotificationForOldCustomer />} />
          </Route>
          
          {/* Agar koi galat URL daale to Auth page par bhej do */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;