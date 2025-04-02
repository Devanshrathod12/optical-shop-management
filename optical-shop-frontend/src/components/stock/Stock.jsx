import React from 'react';

const Stock = ({ name, price, change, percentageChange }) => {
  return (
    <div className="max-w-xs flex justify-center items-center min-h-screen mx-auto my-4 bg-white shadow-lg rounded-lg p-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 text-center">{name}</h3>
      </div>
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-800">${price}</p>
        <p className={`text-lg font-semibold mt-2 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? `+${change}` : change} ({percentageChange}%)
        </p>
      </div>
    </div>
  );
};

export default Stock;

