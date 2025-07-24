import React, { useState, useEffect } from "react";
import Axios from "axios";
import * as XLSX from "xlsx";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    contactNo: "",
    address: "",
    date: "",
    billNo: "",
    totalAmount: ""
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/custo/get`);
        setCustomers(customersResponse.data.customers || []);

        const salesResponse = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`);
        const salesData = salesResponse.data.sales || {};
        const allSales = Object.values(salesData).flat().filter(sale => sale) || [];
        setMonthlySales(allSales);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if contact number appears multiple times in monthly sales
  const isDuplicateInMonthlySales = (contactNo) => {
    const monthlyEntries = monthlySales.filter(s => s.contactNo === contactNo);
    return monthlyEntries.length > 1;
  };

  // Combine and filter data
  const combinedData = [
    ...customers.map(c => ({ 
      ...c, 
      isFromSales: false,
      isDuplicate: false
    })),
    ...monthlySales.map(s => ({
      name: s?.customerName || "",
      contactNo: s?.contactNo || "",
      address: s?.address || "",
      isFromSales: true,
      billNo: s?.billNo || "",
      total: s?.total || 0,
      isDuplicate: isDuplicateInMonthlySales(s.contactNo)
    }))
  ].filter(item => item?.contactNo);

  // Remove duplicates
  const uniqueData = [];
  const seenContacts = new Set();
  combinedData.forEach(item => {
    if (item.contactNo && !seenContacts.has(item.contactNo)) {
      seenContacts.add(item.contactNo);
      uniqueData.push(item);
    }
  });

  // Sort - customers in both lists first
const sortedData = uniqueData.sort((a, b) => {
  const aContact = a?.contactNo;
  const bContact = b?.contactNo;

  const aInBoth = aContact &&
    customers.some(c => c?.contactNo === aContact) &&
    monthlySales.some(s => s?.contactNo === aContact);

  const bInBoth = bContact &&
    customers.some(c => c?.contactNo === bContact) &&
    monthlySales.some(s => s?.contactNo === bContact);

  return bInBoth - aInBoth;
});


  // Search filter
  const filteredData = sortedData.filter(item => {
    const searchTerm = search.toLowerCase();
    return (
      item.contactNo?.toLowerCase().includes(searchTerm) ||
      item.name?.toLowerCase().includes(searchTerm) ||
      item.billNo?.toString().toLowerCase().includes(searchTerm)
    );
  });

  // Get row style based on customer status
  const getRowStyle = (customer) => {
    const isInBothLists = customers.some(c => c.contactNo === customer.contactNo) && 
                         monthlySales.some(s => s.contactNo === customer.contactNo);
    
    if (isInBothLists || customer.isDuplicate) {
      return { backgroundColor: '#e6ffe6' }; // Light green
    }
    return {};
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const currentEntries = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Edit handlers
  const handleEditClick = (customer) => {
    setEditingCustomer(customer._id);
    setEditFormData({
      name: customer.name || "",
      contactNo: customer.contactNo || "",
      address: customer.address || "",
      date: customer.date || "",
      billNo: customer.billNo || "",
      totalAmount: customer.totalAmount || ""
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/custo/update/${editingCustomer}`,
        editFormData
      );
      setCustomers(customers.map(c => 
        c._id === editingCustomer ? response.data.updatedCustomer : c
      ));
      setEditingCustomer(null);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update customer");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredData.map(item => ({
      Name: item.name,
      "Contact No": item.contactNo,
      Address: item.address,
      "Bill No": item.billNo || "",
      Amount: item.totalAmount || item.total || 0
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "Customers.xlsx");
  };

  

  return (
    <div className="container mt-16 mb-24 mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Customer List</h1>
      
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search customers..."
          className="border p-2 rounded flex-grow text-sm sm:text-base"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button 
          onClick={exportToExcel}
          className="bg-blue-500 text-white p-2 rounded text-sm sm:text-base"
        >
          Export Excel
        </button>
      </div>
  
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-sm sm:text-base">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-2">
              {currentEntries.map((item, index) => {
                const isInBothLists = customers.some(c => c.contactNo === item.contactNo) && 
                                     monthlySales.some(s => s.contactNo === item.contactNo);
                const shouldHighlight = isInBothLists || item.isDuplicate;
                
                return (
                  <div 
                    key={index}
                    className={`p-3 border rounded ${
                      shouldHighlight ? "bg-green-50" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.contactNo}</p>
                      </div>
                      {!item.isFromSales && (
                        <button
                          onClick={() => handleEditClick(item)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {item.address && <p className="text-sm mt-1">📍 {item.address}</p>}
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">Bill No</p>
                        <p>{item.billNo || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p>₹{(item.totalAmount || item.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
  
            {/* Desktop Table View */}
            <table className="hidden sm:table min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base">Name</th>
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base">Contact</th>
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base hidden md:table-cell">Address</th>
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base">Bill No</th>
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base">Amount</th>
                  <th className="py-2 px-2 sm:px-4 border text-left text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => {
                  const isInBothLists = customers.some(c => c.contactNo === item.contactNo) && 
                                       monthlySales.some(s => s.contactNo === item.contactNo);
                  const shouldHighlight = isInBothLists || item.isDuplicate;
                  
                  return (
                    <tr 
                      key={index} 
                      className={shouldHighlight ? "bg-green-50" : ""}
                    >
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base">{item.name}</td>
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base">{item.contactNo}</td>
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base hidden md:table-cell">{item.address}</td>
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base">{item.billNo || '-'}</td>
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base">
                        ₹{(item.totalAmount || item.total || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border text-sm sm:text-base">
                        {!item.isFromSales && (
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
  
          {/* Pagination - Responsive */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
              <div className="text-sm text-gray-600 sm:hidden">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let page = currentPage <= 2 ? i + 1 : 
                             currentPage >= totalPages - 1 ? totalPages - 2 + i :
                             currentPage - 1 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 border rounded text-sm ${
                          currentPage === page ? "bg-blue-500 text-white" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  Last
                </button>
              </div>
              
              <div className="text-sm text-gray-600 hidden sm:block">
                Showing {currentEntries.length} of {filteredData.length} entries
              </div>
            </div>
          )}
        </>
      )}
  
      {/* Edit Modal - Responsive */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md mx-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg sm:text-xl font-bold">Edit Customer</h2>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-sm sm:text-base">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full border p-2 rounded text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm sm:text-base">Contact No</label>
                  <input
                    type="text"
                    name="contactNo"
                    value={editFormData.contactNo}
                    onChange={(e) => setEditFormData({...editFormData, contactNo: e.target.value})}
                    className="w-full border p-2 rounded text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm sm:text-base">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full border p-2 rounded text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-sm sm:text-base">Bill No</label>
                    <input
                      type="text"
                      name="billNo"
                      value={editFormData.billNo}
                      onChange={(e) => setEditFormData({...editFormData, billNo: e.target.value})}
                      className="w-full border p-2 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm sm:text-base">Amount</label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={editFormData.totalAmount}
                      onChange={(e) => setEditFormData({...editFormData, totalAmount: e.target.value})}
                      className="w-full border p-2 rounded text-sm sm:text-base"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3 sm:px-4 py-1 sm:py-2 border rounded text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;