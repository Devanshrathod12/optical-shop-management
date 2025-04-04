import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const WholesalerList = () => {
  const [wholesalers, setWholesalers] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWholesalers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/who/all`
        );
        const data = await response.json();
        if (data.success) {
          const groupedWholesalers = data.wholesalers.reduce(
            (acc, wholesaler) => {
              if (!acc[wholesaler.name]) acc[wholesaler.name] = [];
              acc[wholesaler.name].push(wholesaler);
              return acc;
            },
            {}
          );
          setWholesalers(groupedWholesalers);
        }
      } catch (error) {
        console.error("Error fetching wholesalers:", error);
      }
    };
    fetchWholesalers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto  mt-20 mb-20 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Wholesaler List
      </h2>

      {/* Buttons - Mobile pe Stack, Desktop pe Inline */}

      <div className="space-y-6">
        {Object.entries(wholesalers).map(([name, frames], index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              {name}
            </h3>

            {/* Grid - Mobile 1 Column, Tablet 2 Columns, Desktop 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frames.map((wholesaler) => (
                <div
                  key={wholesaler._id}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                >
                  <p className="text-gray-800 font-medium">
                    <span className="font-semibold">Frame Type:</span>{" "}
                    {wholesaler.frameType}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Brand:</span>{" "}
                    {wholesaler.frameBrand}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-600">Price:</span>{" "}
                    ₹{wholesaler.framePrice}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-red-600">
                      Quantity:
                    </span>{" "}
                    {wholesaler.quantity}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">ID:</span>{" "}
                    {wholesaler.uniqueID}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WholesalerList;
