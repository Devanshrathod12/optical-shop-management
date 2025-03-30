import React, { useState, useEffect } from "react";
import Axios from "axios";
import * as XLSX from "xlsx";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/custo/get`);
        setCustomers(customersResponse.data.customers);

        const salesResponse = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`);
        const salesData = salesResponse.data.sales;

        const allSales = Object.values(salesData).flat();
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

  const monthlySalesContactNumbers = monthlySales.map(sale => sale.contactNo);
  const isContactNumberInBoth = (contactNo) => {
    return customers.some(customer => customer.contactNo === contactNo) &&
           monthlySalesContactNumbers.includes(contactNo);
  };

  const combinedData = [
    ...customers.map(customer => ({
      ...customer,
      isFromSales: false,
    })),
    ...monthlySales.map(sale => ({
      name: sale.customerName,
      contactNo: sale.contactNo,
      address: sale.address,
      isFromSales: true,
    })),
  ];

  const uniqueData = [];
  const seenContactNumbers = new Set();

  combinedData.forEach((item) => {
    if (!seenContactNumbers.has(item.contactNo)) {
      seenContactNumbers.add(item.contactNo);
      uniqueData.push(item);
    }
  });

  const sortedData = uniqueData.sort((a, b) => {
    const aHighlighted = isContactNumberInBoth(a.contactNo);
    const bHighlighted = isContactNumberInBoth(b.contactNo);

    if (aHighlighted && !bHighlighted) return -1;
    if (!aHighlighted && bHighlighted) return 1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.contactNo.includes(search)
  );

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
          placeholder="Search by Contact No..."
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
                  ${isContactNumberInBoth(item.contactNo) ? "bg-green-300" : "bg-white"}`}
              >
                <div>
                  <p className="text-xl font-semibold">{item.name}</p>
                  <p className="text-gray-700 text-lg">📞 {item.contactNo}</p>
                  <p className="text-gray-700">📍 {item.address}</p>
                </div>
                {item.isFromSales && (
                  <span className="self-end px-4 py-2 text-md font-medium bg-blue-600 text-white rounded-lg">
                    From Sales
                  </span>
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
