import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddWholesaler = () => {
  const [wholesaler, setWholesaler] = useState({
    name: "",
    framePrice: "",
    frameType: "",
    frameBrand: "",
    quantity: "",
    billNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setWholesaler({ ...wholesaler, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("API URL:", import.meta.env.VITE_BACKEND_URL + "/api/Who/add"); // Debugging
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Who/add`,
        wholesaler,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        alert("Wholesaler added successfully!");
        setWholesaler({ name: "", framePrice: "", frameType: "", frameBrand: "", quantity: "", billNumber: "" });
      } else {
        alert("Error adding wholesaler");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 relative">
  
    {/* Background Watermark / Optical Sign */}
    <div className="absolute inset-0 flex justify-center items-center opacity-10 text-8xl font-bold text-gray-400">
      Vinayak Optical
    </div>
  
    <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg relative z-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Stock</h2>
  
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        
      </div>
  
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" name="name" placeholder="Wholesaler Name" onChange={handleChange} value={wholesaler.name} required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="number" name="framePrice" placeholder="Frame Price" onChange={handleChange} value={wholesaler.framePrice} required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-400"
          />
          <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} value={wholesaler.quantity} required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
          />
        </div>
  
        <input type="text" name="frameType" placeholder="Frame Type" onChange={handleChange} value={wholesaler.frameType} required 
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
        />
        <input type="text" name="frameBrand" placeholder="Frame Brand" onChange={handleChange} value={wholesaler.frameBrand} required 
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
        />
        <input type="text" name="billNumber" placeholder="Bill Number" onChange={handleChange} value={wholesaler.billNumber} required 
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
        />
        
        <button type="submit" 
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition">
          Add Stock
        </button>
      </form>
    </div>
  </div>
  

  );
};

export default AddWholesaler;
