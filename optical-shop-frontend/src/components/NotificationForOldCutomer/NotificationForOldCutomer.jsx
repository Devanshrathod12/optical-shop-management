import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { FaWhatsapp, FaUserClock, FaRedo, FaFilter, FaSpinner } from 'react-icons/fa';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'; // For status icons

const NotificationForOldCustomer = () => {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', '3months', '6months', 'above6months'
  const [searchQuery, setSearchQuery] = useState('');

  // API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchCustomerAndSalesData();
  }, []);

  const fetchCustomerAndSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const customersResponse = await Axios.get(`${API_BASE_URL}/api/custo/get`);
      const monthlySalesResponse = await Axios.get(`${API_BASE_URL}/api/sales/monthly`);

      const allCustomers = customersResponse.data.customers || [];
      const salesData = monthlySalesResponse.data.sales || {};
      const allSales = Object.values(salesData).flat().filter(sale => sale) || [];

      // Process and combine data
      const processedCustomers = processCustomerData(allCustomers, allSales);
      setCustomersData(processedCustomers);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load customer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processCustomerData = (staticCustomers, monthlySales) => {
    const customerMap = new Map(); // contactNo -> customerObject

    // First, add all customers from the static customer list
    staticCustomers.forEach(c => {
      customerMap.set(c.contactNo, {
        ...c,
        lastPurchaseDate: moment(c.date), // Assuming 'date' field exists for static customers
        purchaseHistory: [],
        isRepeat: false,
        source: 'static'
      });
    });

    // Then, integrate and update with sales data
    monthlySales.forEach(sale => {
      if (sale.contactNo) {
        const existingCustomer = customerMap.get(sale.contactNo);
        const saleDate = moment(sale.date);

        if (existingCustomer) {
          // Update existing customer with sales info
          if (!existingCustomer.lastPurchaseDate || saleDate.isAfter(existingCustomer.lastPurchaseDate)) {
            existingCustomer.lastPurchaseDate = saleDate;
          }
          existingCustomer.purchaseHistory.push(sale);
          if (existingCustomer.purchaseHistory.length > 1 || existingCustomer.source === 'static') {
            existingCustomer.isRepeat = true;
          }
          // Prioritize sales data for main details if static data is old/missing
          existingCustomer.name = sale.customerName || existingCustomer.name;
          existingCustomer.address = sale.address || existingCustomer.address;
          existingCustomer.billNo = sale.billNo || existingCustomer.billNo;
          existingCustomer.total = sale.total || existingCustomer.total;

        } else {
          // Add new customer from sales data
          customerMap.set(sale.contactNo, {
            name: sale.customerName,
            contactNo: sale.contactNo,
            address: sale.address,
            billNo: sale.billNo,
            total: sale.total,
            lastPurchaseDate: saleDate,
            purchaseHistory: [sale],
            isRepeat: false, // Will be set to true if another sale for this contact is found later
            source: 'sales'
          });
        }
      }
    });

    // Final pass to ensure isRepeat is correctly set and calculate time since last purchase
    const finalCustomers = Array.from(customerMap.values()).map(customer => {
      const now = moment();
      const monthsSinceLastPurchase = customer.lastPurchaseDate ? now.diff(customer.lastPurchaseDate, 'months') : Infinity;
      
      // If customer has more than one entry in purchase history, they are a repeat customer
      if (customer.purchaseHistory.length > 1) {
        customer.isRepeat = true;
      }
      
      return {
        ...customer,
        monthsSinceLastPurchase: monthsSinceLastPurchase,
        lastPurchaseDateFormatted: customer.lastPurchaseDate ? customer.lastPurchaseDate.format('YYYY-MM-DD') : 'N/A',
      };
    });

    return finalCustomers;
  };

  const getCustomerCategory = (months) => {
    if (months === Infinity) return 'New/No Purchase Date';
    if (months <= 3) return 'Recent Customer (< 3 Months)';
    if (months <= 6) return 'Old Customer (3-6 Months)';
    return 'Very Old Customer (> 6 Months)';
  };

  const filteredCustomers = customersData.filter(customer => {
    const matchesFilter = () => {
      if (filter === 'all') return true;
      if (filter === '3months') return customer.monthsSinceLastPurchase > 3 && customer.monthsSinceLastPurchase <= 6;
      if (filter === '6months') return customer.monthsSinceLastPurchase > 6;
      if (filter === 'repeat') return customer.isRepeat;
      return true;
    };

    const matchesSearch = () => {
      const query = searchQuery.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(query) ||
        customer.contactNo?.toLowerCase().includes(query) ||
        customer.billNo?.toString().toLowerCase().includes(query) ||
        customer.address?.toLowerCase().includes(query)
      );
    };
    return matchesFilter() && matchesSearch();
  });

  return (
    <div className="max-w-7xl mx-auto mt-20 p-4 md:p-8 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-lg rounded-xl border border-gray-200">
      <div className="group mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 relative inline-block">
          <FaUserClock className="inline mr-3 text-emerald-600" />
          Old Customer Notifications
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Identify and re-engage your valuable old customers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex-grow w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, contact, bill no..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
          >
            <option value="all">All Customers</option>
            <option value="repeat">Repeat Customers</option>
            <option value="3months">Customers (3-6 Months Old)</option>
            <option value="6months">Customers (- 6 Months Old)</option>
          </select>
          <button
            onClick={fetchCustomerAndSalesData}
            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg shadow hover:shadow-md transition-all hover:-translate-y-0.5 border border-emerald-200 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaRedo />}
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-emerald-700 text-lg">
          <FaSpinner className="animate-spin inline-block mr-2" /> Loading customer data...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <FiAlertCircle className="inline mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && filteredCustomers.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-center">
          <FiCheckCircle className="inline mr-2" />
          No customers found matching your criteria.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border 
              ${customer.isRepeat ? 'border-green-400' : 'border-gray-200'}
              ${customer.monthsSinceLastPurchase > 6 ? 'bg-orange-50' : 
                customer.monthsSinceLastPurchase > 3 ? 'bg-yellow-50' : 'bg-white'}
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {customer.name || 'N/A'}
                {customer.isRepeat && (
                  <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs font-semibold rounded-full flex items-center">
                    <FaRedo className="mr-1" /> Repeat
                  </span>
                )}
              </h3>
              <a 
                href={`https://wa.me/${customer.contactNo}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-700 transition-colors"
                title={`Message ${customer.name} on WhatsApp`}
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Contact:</span> {customer.contactNo || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {customer.address || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Last Purchase:</span> {customer.lastPurchaseDateFormatted}
              </p>
              <p className="flex items-center">
                <span className="font-semibold">Time Since Last Purchase:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${customer.monthsSinceLastPurchase <= 3 ? 'bg-blue-100 text-blue-800' :
                    customer.monthsSinceLastPurchase <= 6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`
                }>
                  {customer.monthsSinceLastPurchase === Infinity ? 'No Record' :
                   `${customer.monthsSinceLastPurchase} months ago`}
                </span>
              </p>
              {customer.purchaseHistory && customer.purchaseHistory.length > 0 && (
                <div>
                  <p className="font-semibold mt-3 mb-1">Last Transaction Details:</p>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    <li>Bill No: {customer.purchaseHistory[customer.purchaseHistory.length - 1]?.billNo || 'N/A'}</li>
                    <li>Total: {customer.purchaseHistory[customer.purchaseHistory.length - 1]?.total || 0} Rs.</li>
                    <li>Date: {moment(customer.purchaseHistory[customer.purchaseHistory.length - 1]?.date).format('YYYY-MM-DD') || 'N/A'}</li>
                  </ul>
                </div>
              )}
            </div>
            {customer.isRepeat && customer.purchaseHistory.length > 1 && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
                <p className="font-semibold text-gray-800">Purchase History Summary:</p>
                <ul className="list-disc list-inside">
                  {customer.purchaseHistory.map((sale, saleIdx) => (
                    <li key={saleIdx}>
                      {moment(sale.date).format('YYYY-MM-DD')} - Bill: {sale.billNo}, Total: {sale.total} Rs.
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationForOldCustomer;