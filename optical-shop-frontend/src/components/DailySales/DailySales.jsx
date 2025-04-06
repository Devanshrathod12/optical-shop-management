import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../components/StoreContext/StoreContext";

const DailySales = () => {
  const navigate = useNavigate();
  const { addSale, loading } = useStore();
  
  const [sale, setSale] = useState({
    billNo: "",
    date: "",
    customerName: "",
    age: "",
    address: "",
    contactNo: "",
    lensType: "",
    frameName: "",
    glasses: "",
    total: "",
    advance: "",
    balance: "",
    framePurchasingPrice: "",
    LensPurchasingPrice: "",
    Fiting: "",
    boxcloth: "",
    uniqueID: ""
  });

  const handleChange = (e) => {
    setSale({ ...sale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSale(sale);
      // Reset form after successful submission
      setSale({
        billNo: "",
        date: "",
        customerName: "",
        age: "",
        address: "",
        contactNo: "",
        lensType: "",
        frameName: "",
        glasses: "",
        total: "",
        advance: "",
        balance: "",
        framePurchasingPrice: "",
        LensPurchasingPrice: "",
        Fiting: "",
        boxcloth: "",
        uniqueID: ""
      });
    } catch (error) {
      
    }
  };

  return (
    <div className="min-h-screen mt-16 mb-5 bg-cover bg-center flex items-center justify-center">
      <div className="absolute"></div>
      <div className="relative z-10 max-w-3xl w-full p-8 bg-white bg-opacity-90 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-700">
          Daily Sales Entry
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bill No */}
          <div>
            <label htmlFor="billNo" className="block text-sm font-medium text-gray-700 mb-1">
              Bill No:
            </label>
            <input
              type="text"
              id="billNo"
              name="billNo"
              placeholder="Enter Bill No"
              onChange={handleChange}
              value={sale.billNo}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              onChange={handleChange}
              value={sale.date}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              placeholder="Enter Customer Name"
              onChange={handleChange}
              value={sale.customerName}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter Age"
              onChange={handleChange}
              value={sale.age}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter Address"
              onChange={handleChange}
              value={sale.address}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Contact No */}
          <div>
            <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
              Contact No:
            </label>
            <input
              type="text"
              id="contactNo"
              name="contactNo"
              placeholder="Enter Contact No"
              onChange={handleChange}
              value={sale.contactNo}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Lens Type */}
          <div>
            <label htmlFor="lensType" className="block text-sm font-medium text-gray-700 mb-1">
              Lens Type:
            </label>
            <input
              type="text"
              id="lensType"
              name="lensType"
              placeholder="Enter Lens Type"
              onChange={handleChange}
              value={sale.lensType}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Frame Name */}
          <div>
            <label htmlFor="frameName" className="block text-sm font-medium text-gray-700 mb-1">
              Frame Name:
            </label>
            <input
              type="text"
              id="frameName"
              name="frameName"
              placeholder="Enter Frame Name"
              onChange={handleChange}
              value={sale.frameName}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Unique ID */}
          <div>
            <label htmlFor="uniqueID" className="block text-sm font-medium text-gray-700 mb-1">
              Frame Unique ID (optional):
            </label>
            <input
              type="text"
              id="uniqueID"
              name="uniqueID"
              placeholder="Enter Frame Unique ID to update quantity"
              onChange={handleChange}
              value={sale.uniqueID}
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Glasses */}
          <div>
            <label htmlFor="glasses" className="block text-sm font-medium text-gray-700 mb-1">
              Glasses:
            </label>
            <input
              type="text"
              id="glasses"
              name="glasses"
              placeholder="Enter Glasses"
              onChange={handleChange}
              value={sale.glasses}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Total */}
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
              Total:
            </label>
            <input
              type="number"
              id="total"
              name="total"
              placeholder="Enter Total"
              onChange={handleChange}
              value={sale.total}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Advance */}
          <div>
            <label htmlFor="advance" className="block text-sm font-medium text-gray-700 mb-1">
              Advance:
            </label>
            <input
              type="number"
              id="advance"
              name="advance"
              placeholder="Enter Advance"
              onChange={handleChange}
              value={sale.advance}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Balance */}
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
              Balance:
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              placeholder="Enter Balance"
              onChange={handleChange}
              value={sale.balance}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Frame Purchasing Price */}
          <div>
            <label htmlFor="framePurchasingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Frame Purchasing Price:
            </label>
            <input
              type="number"
              id="framePurchasingPrice"
              name="framePurchasingPrice"
              placeholder="Enter Frame Purchasing Price"
              onChange={handleChange}
              value={sale.framePurchasingPrice}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Lens Purchasing Price */}
          <div>
            <label htmlFor="LensPurchasingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Lens Purchasing Price:
            </label>
            <input
              type="number"
              id="LensPurchasingPrice"
              name="LensPurchasingPrice"
              placeholder="Enter Lens Purchasing Price"
              onChange={handleChange}
              value={sale.LensPurchasingPrice}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Fitting */}
          <div>
            <label htmlFor="Fiting" className="block text-sm font-medium text-gray-700 mb-1">
              Fitting:
            </label>
            <input
              type="number"
              id="Fiting"
              name="Fiting"
              placeholder="Enter Fitting Cost"
              onChange={handleChange}
              value={sale.Fiting}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Box & Cloth */}
          <div>
            <label htmlFor="boxcloth" className="block text-sm font-medium text-gray-700 mb-1">
              Box & Cloth:
            </label>
            <input
              type="number"
              id="boxcloth"
              name="boxcloth"
              placeholder="Enter Box and Cloth Cost"
              onChange={handleChange}
              value={sale.boxcloth}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-gray-50"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-32 mb-10 py-3 text-white rounded-md shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {loading ? 'Processing...' : 'Add Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailySales;