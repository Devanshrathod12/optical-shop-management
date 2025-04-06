import React, { useState, useEffect } from "react";
import { useStore } from "../../components/StoreContext/StoreContext";

const Stock = () => {
  const [stock, setStock] = useState([]);
  const { getAllStock, loading } = useStore();

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await getAllStock();
      if (response.success) {
        setStock(response.wholesalers);
      } else {
        console.error("Error fetching stock data:", response.message);
      }
    } catch (err) {
      console.error("Error fetching stock:", err);
    }
  };

  // Group stock by first letter of uniqueID
  const groupedStock = stock.reduce((acc, item) => {
    const firstLetter = item.uniqueID.charAt(0);
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});

  // Calculate totals for each group
  const groupTotals = Object.keys(groupedStock).reduce((acc, letter) => {
    acc[letter] = {
      totalItems: groupedStock[letter].length,
      totalQuantity: groupedStock[letter].reduce((sum, item) => sum + item.quantity, 0),
      totalValue: groupedStock[letter].reduce((sum, item) => sum + (item.framePrice * item.quantity), 0)
    };
    return acc;
  }, {});

  return (
    <div className="p-6 mt-24 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Stock Inventory</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-blue-800 font-semibold">Total Categories</h3>
          <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedStock).length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-green-800 font-semibold">Total Frames</h3>
          <p className="text-2xl font-bold text-green-600">{stock.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-purple-800 font-semibold">Total Quantity</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stock.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Stock by Category */}
      {Object.entries(groupedStock).map(([letter, items]) => (
        <div key={letter} className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Category {letter} ({groupTotals[letter].totalItems} items)
            </h3>
            <div className="flex gap-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                Qty: {groupTotals[letter].totalQuantity}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                Value: ₹{groupTotals[letter].totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frame Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.uniqueID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {item.uniqueID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {item.frameType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ₹{item.framePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity > 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.quantity}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      ₹{(item.framePrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stock;