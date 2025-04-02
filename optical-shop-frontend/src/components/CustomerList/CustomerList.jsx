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
        console.error("API Fetch Error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/custo/update/${editingCustomer}`,
        editFormData
      );
      
      setCustomers(customers.map(customer => 
        customer._id === editingCustomer ? response.data.updatedCustomer : customer
      ));
      
      setEditingCustomer(null);
    } catch (err) {
      console.error("Update Error:", err);
      setError("Failed to update customer");
    }
  };

  const monthlySalesContactNumbers = monthlySales
    .map(sale => sale?.contactNo)
    .filter(contactNo => contactNo !== undefined);

  const isContactNumberInBoth = (contactNo) => {
    if (!contactNo) return false;
    return customers.some(customer => customer?.contactNo === contactNo) &&
           monthlySalesContactNumbers.includes(contactNo);
  };

  const combinedData = [
    ...customers.map(customer => ({
      ...customer,
      isFromSales: false,
    })),
    ...monthlySales.map(sale => ({
      name: sale?.customerName || "",
      contactNo: sale?.contactNo || "",
      address: sale?.address || "",
      isFromSales: true,
      billNo: sale?.billNo || "",
      total: sale?.total || 0,
    })),
  ].filter(item => item?.contactNo);

  const uniqueData = [];
  const seenContactNumbers = new Set();

  combinedData.forEach((item) => {
    if (item?.contactNo && !seenContactNumbers.has(item.contactNo)) {
      seenContactNumbers.add(item.contactNo);
      uniqueData.push(item);
    }
  });

  const sortedData = uniqueData.sort((a, b) => {
    const aHighlighted = isContactNumberInBoth(a?.contactNo);
    const bHighlighted = isContactNumberInBoth(b?.contactNo);

    if (aHighlighted && !bHighlighted) return -1;
    if (!aHighlighted && bHighlighted) return 1;
    return 0;
  });

  // Updated search to include both contactNo and name
  const filteredData = sortedData.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item?.contactNo?.toLowerCase().includes(searchTerm) ||
      item?.name?.toLowerCase().includes(searchTerm)
    );
  });

  const exportToExcel = () => {
    const dataToExport = filteredData.map(({ name, contactNo }) => ({ name, contactNo }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "Customer_List.xlsx");
  };

  return (
    <div className="flex flex-col items-center mt-20 mb-16 justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-7xl bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">Customer List with Monthly Sales</h2>
        <p className="text-lg text-gray-700 mb-6">
          Total Entries: <span className="font-bold text-blue-600">{filteredData.length}</span>
        </p>
        <input
          type="text"
          placeholder="Search by Contact No or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-2xl p-4 border border-gray-300 rounded-md mb-6 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={exportToExcel}
          className="mb-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          📥 Export to Excel
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className={`p-6 flex flex-col justify-between rounded-xl shadow-md w-full min-h-[180px]
                  ${isContactNumberInBoth(item?.contactNo) ? "bg-green-300" : "bg-white"}`}
              >
                {editingCustomer === item?._id ? (
                  <form onSubmit={handleEditFormSubmit} className="w-full space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact No</label>
                      <input
                        type="text"
                        name="contactNo"
                        value={editFormData.contactNo}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bill No</label>
                      <input
                        type="text"
                        name="billNo"
                        value={editFormData.billNo}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={editFormData.totalAmount}
                        onChange={handleEditFormChange}
                        className="w-full p-2 border rounded"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <p className="text-xl font-semibold">{item?.name}</p>
                      <p className="text-gray-700 text-lg">📞 {item?.contactNo}</p>
                      {item?.address && <p className="text-gray-700">📍 {item.address}</p>}
                      {item?.date && <p className="text-gray-700">📅 {new Date(item.date).toLocaleDateString()}</p>}
                      
                      {item?.totalAmount && <p className="text-gray-700">💰 Total: ₹{Number(item.totalAmount).toFixed(2)}</p>}
                      {item?.isFromSales && (
                        <>
                          <p className="text-gray-700 mt-2">🧾 Bill No: {item.billNo}</p>
                          <p className="text-gray-700">💰 Total: ₹{(item.total || 0).toFixed(2)}</p>
                        </>
                      )}
                    </div>
                    {!item?.isFromSales && item?._id && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {item?.isFromSales && (
                      <span className="self-end px-4 py-2 text-md font-medium bg-green-500 text-white rounded-lg">
                        Sales
                      </span>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500 col-span-full">No entries found</p>
          )}
        </div>
        {error && <p className="text-center text-red-600">{error}</p>}
        {loading && <p className="text-center text-blue-600 text-xl font-semibold">Loading data...</p>}
      </div>
    </div>
  );
};

export default CustomerList;