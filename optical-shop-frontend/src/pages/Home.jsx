import React,{useState,useEffect} from "react";
import logo from "../assets/homenama.png";
import axios from "axios";
import { useStore } from "../components/StoreContext/StoreContext";
const Home = () => {
   const [totalCustomers, setTotalCustomers] = useState(0);
  const {getAllStock,getMonthlySales} = useStore()
  const [stocks,setStocks] = useState({ wholesalers: [] })
const [monthsale, setMonthsale] = useState({});

const TotalFrameQuantity = stocks?.wholesalers?.reduce(
  (total, wholesaler) => total + (wholesaler.quantity || 0), 0
) || 0;

const fetchMonthlySale = async () => {
  try {
    const MonthlySales = await getMonthlySales()
    setMonthsale(MonthlySales)
  } catch (error) {
    console.log("error to get monthly sales data", error)
  }
}
useEffect(() => {
  fetchMonthlySale()
}, [])

  useEffect(() => {
    fetchstockdata()
  }, [])
  
  const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
const currentMonthKey = `${currentYear}-${currentMonth}`;

const currentMonthSales = monthsale[currentMonthKey] || [];

const totalSalesAmount = currentMonthSales.reduce((total, sale) => {
  return total + (sale.total || 0);  // assume 'total' me sale ka amount hai
}, 0);

  const fetchstockdata = async () => {
    try {
      const allstock = await getAllStock()
      console.log(allstock)
      setStocks(allstock)
    } catch (error) {
      console.log("error to fetch stock data",error)
    }
  }

   useEffect(() => {
    const fetchTotalCustomers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/custo/get`);
    const customers = Array.isArray(response.data)
      ? response.data
      : response.data.customers;

    setTotalCustomers(customers.length);
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }
};

    fetchTotalCustomers();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-start px-4 sm:px-6 md:px-10 py-12">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto text-center mb-12">
        <img 
          src={logo} 
          alt="Shree Vinayak Optical Admin" 
          className="w-32 mx-auto mt-5 opacity-90"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          <span className="border-b-4 border-blue-600 pb-2">Shree Vinayak Optical</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 font-medium">
          Inventory & Business Management System
        </p>
      </div>

      {/* <div>
        <h1>api data get</h1>
         <ul>
          {stocks.map((item,index)=>(
           <li key={index} >
            <strong>Name</strong> {item.}
           </li>
          ))}
         </ul>
        </div> 
       */}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {[
          {
            title: "Inventory Summary",
            desc: "Manage frames, lenses and stock",
            count: `${TotalFrameQuantity} items`,
            color: "bg-blue-100 border-blue-500"
          },
          {
            title: "Today's Sales",
            desc: "Orders processed today",
            count: "₹24,850",
            color: "bg-green-100 border-green-500"
          },
          {
            title: "Pending Orders",
            desc: "Require your attention",
            count: "7 Orders",
            color: "bg-amber-100 border-amber-500"
          },
          {
            title: "Customer Database",
            desc: "Manage client records",
            count: `${totalCustomers}`,
            color: "bg-purple-100 border-purple-500"
          },
          {
            title: "Appointments",
            desc: "Eye tests scheduled",
            count: "5 Today",
            color: "bg-cyan-100 border-cyan-500"
          },
          {
            title: "Monthly Revenue",
            desc: "Current month earnings",
            count: `${totalSalesAmount} Sales`,
            color: "bg-emerald-100 border-emerald-500"
          }
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

      {/* Quick Actions */}
      <div className="mt-12 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Add New Product", icon: "＋" },
            { label: "Process Order", icon: "🛒" },
            { label: "Generate Report", icon: "📊" },
            { label: "Customer Lookup", icon: "🔍" }
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