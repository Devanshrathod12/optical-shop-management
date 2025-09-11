import React, { useState, useEffect } from "react";
import logo from "../assets/homenama.png";
import axios from "axios";
import { useStore } from "../components/StoreContext/StoreContext";

const Home = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const { getAllStock, getMonthlySales } = useStore();
  const [stocks, setStocks] = useState({ wholesalers: [] });
  const [monthsale, setMonthsale] = useState({});
  const [totalStockValue, setTotalStockValue] = useState(0); // New state for total stock value

  const TotalFrameQuantity = stocks?.wholesalers?.reduce(
    (total, wholesaler) => total + (wholesaler.quantity || 0),
    0
  ) || 0;

  const fetchMonthlySale = async () => {
    try {
      const MonthlySales = await getMonthlySales();
      setMonthsale(MonthlySales);
    } catch (error) {
      console.log("error to get monthly sales data", error);
    }
  };

  const fetchStockData = async () => {
    try {
      const allstock = await getAllStock();
      setStocks(allstock);

      // Calculate total stock value here
      let calculatedTotalValue = 0;
      if (allstock?.wholesalers) {
        calculatedTotalValue = allstock.wholesalers.reduce(
          (sum, item) => sum + (item.framePrice * item.quantity || 0),
          0
        );
      }
      setTotalStockValue(calculatedTotalValue); // Set the new state
    } catch (error) {
      console.log("error to fetch stock data", error);
    }
  };

  useEffect(() => {
    fetchMonthlySale();
    fetchStockData(); // Fetch stock data on component mount
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const currentMonthKey = `${currentYear}-${currentMonth}`;

  // Calculate Overall Shop Sales and Overall Profit
  let overallTotalSales = 0;
  let overallTotalProfit = 0;

  Object.keys(monthsale).forEach((monthKey) => {
    const salesForMonth = monthsale[monthKey];
    salesForMonth.forEach((sale) => {
      overallTotalSales += sale.total || 0;
      const profit =
        (sale.total || 0) -
        (sale.framePurchasingPrice || 0) -
        (sale.LensPurchasingPrice || 0) -
        (sale.Fiting || 0) -
        (sale.boxcloth || 0);
      overallTotalProfit += profit;
    });
  });

  // Current month sales
  const currentMonthSales = monthsale[currentMonthKey] || [];
  const totalCurrentMonthSalesAmount = currentMonthSales.reduce((total, sale) => {
    return total + (sale.total || 0);
  }, 0);

  // Monthly expenses calculation
  const fixedExpenses = 35000; // Total fixed expenses (30000 rent + 2500 petrol + 2500 electricity)
  const monthlyRevenue = totalCurrentMonthSalesAmount - fixedExpenses;

  // Determine color based on whether sales cover expenses
  let expenseColor = "bg-red-100 border-red-500"; // Default to red
  if (totalCurrentMonthSalesAmount >= fixedExpenses) {
    expenseColor = "bg-green-100 border-green-500"; // Green if sales cover expenses
  } else if (totalCurrentMonthSalesAmount >= fixedExpenses * 0.7) {
    expenseColor = "bg-orange-100 border-orange-500"; // Orange if sales cover at least 70% of expenses
  }

  useEffect(() => {
    const fetchTotalCustomers = async () => {
      try {
        const customersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/custo/get`
        );
        const customers = Array.isArray(customersResponse.data)
          ? customersResponse.data
          : customersResponse.data.customers || [];

        const salesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`
        );
        const salesData = salesResponse.data.sales || {};
        const allSales = Object.values(salesData).flat().filter((sale) => sale) || [];

        const combinedData = [
          ...customers.map((c) => ({
            ...c,
            isFromSales: false,
          })),
          ...allSales.map((s) => ({
            name: s?.customerName || "",
            contactNo: s?.contactNo || "",
            address: s?.address || "",
            isFromSales: true,
            billNo: s?.billNo || "",
            total: s?.total || 0,
          })),
        ].filter((item) => item?.contactNo);

        const uniqueCustomers = [];
        const seenContacts = new Set();
        combinedData.forEach((item) => {
          if (item.contactNo && !seenContacts.has(item.contactNo)) {
            seenContacts.add(item.contactNo);
            uniqueCustomers.push(item);
          }
        });

        setTotalCustomers(uniqueCustomers.length);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchTotalCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-start px-4 sm:px-6 md:px-10 py-12">
      <div className="w-full max-w-6xl mx-auto text-center mb-12">
        <img src={logo} alt="Shree Vinayak Optical Admin" className="w-32 mx-auto mt-5 opacity-90" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          <span className="border-b-4 border-blue-600 pb-2">Shree Vinayak Optical</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Inventory & Business Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {[
          {
            title: "Inventory Summary",
            desc: "Total frames in stock",
            count: `${TotalFrameQuantity} items`,
            color: "bg-blue-100 border-blue-500",
          },
          {
            title: "Total Stock Value", // New Card Title
            desc: "Total worth of frames in stock", // New Card Description
            count: `₹${totalStockValue.toLocaleString("en-IN")}`, // New Card Value
            color: "bg-indigo-100 border-indigo-500", // New Card Color
          },
          {
            title: "Overall Shop Sales",
            desc: "Total revenue to date",
            count: `₹${overallTotalSales.toLocaleString("en-IN")}`,
            color: "bg-green-100 border-green-500",
          },
          {
            title: "Overall Shop Profit",
            desc: "Net earnings from all sales",
            count: `₹${overallTotalProfit.toLocaleString("en-IN")}`,
            color:
              overallTotalProfit >= 0
                ? "bg-emerald-100 border-emerald-500"
                : "bg-red-100 border-red-500",
          },
          {
            title: "Customer Database",
            desc: "Total unique customers",
            count: `${totalCustomers} Customers`,
            color: "bg-purple-100 border-purple-500",
          },
          {
            title: "Monthly Expenses",
            desc: "Fixed costs: ₹30k rent + ₹2.5k petrol + ₹2.5k electricity",
            count: `₹${fixedExpenses.toLocaleString("en-IN")}`,
            color: "bg-gray-100 border-gray-500",
          },
          {
            title: "Monthly Revenue",
            desc: "Current month's earnings after expenses",
            count: `₹${monthlyRevenue.toLocaleString("en-IN")}`,
            color: expenseColor,
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`border-l-4 ${card.color} p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white`}
          >
            <h3 className="font-bold text-gray-800 text-xl">{card.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{card.desc}</p>
            <p className="text-2xl font-bold mt-3 text-gray-900">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Add New Product", icon: "＋" },
            { label: "Process Order", icon: "🛒" },
            { label: "Generate Report", icon: "📊" },
            { label: "Customer Lookup", icon: "🔍" },
          ].map((action, i) => (
            <button
              key={i}
              className="bg-white py-3 px-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
            >
              <span className="text-2xl block mb-1">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;