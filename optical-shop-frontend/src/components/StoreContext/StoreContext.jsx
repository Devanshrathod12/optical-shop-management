import { createContext, useContext, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // ======================= SALES API FUNCTIONS =======================
  const addSale = async (saleData) => {
    setLoading(true);
    try {
      const response = await Axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/sales/add`,
        saleData
      );
      
      if (saleData.uniqueID) {
        try {
          await updateFrameQuantity(saleData.uniqueID);
          toast.success("Frame quantity updated successfully!");
        } catch (error) {
          toast.warning("Sale added but frame quantity update failed");
          console.error("Frame update error:", error);
        }
      }
      
      toast.success("Sale added successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding sale");
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlySales = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`
      );
      
      const groupedSales = response.data.sales.reduce((acc, sale) => {
        const month = moment(sale.date).format("YYYY-MM");
        if (!acc[month]) acc[month] = [];
        acc[month].push(sale);
        return acc;
      }, {});

      return groupedSales;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching monthly sales");
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id, saleData) => {
    setLoading(true);
    try {
      const response = await Axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sales/update/${id}`,
        saleData
      );
      toast.success("Sale updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating sale");
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ======================= STOCK API FUNCTIONS =======================
  const getAllStock = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/who/all`
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching stock");
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFrameQuantity = async (uniqueID) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Who/update-quantity/${uniqueID}`
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating frame quantity");
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ======================= EXPORT FUNCTIONS =======================
  const value = {
    // Sales functions
    addSale,
    getMonthlySales,
    updateSale,
    
    // Stock functions
    getAllStock,
    updateFrameQuantity,
    
    // State
    loading
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};