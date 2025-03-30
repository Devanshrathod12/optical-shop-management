import { useState, useEffect } from "react";
import Axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const MonthlySales = () => {
  const [sales, setSales] = useState({});
  const [editingSale, setEditingSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`);
        
        const groupedSales = response.data.sales.reduce((acc, sale) => {
          const month = moment(sale.date).format("YYYY-MM");
          if (!acc[month]) acc[month] = [];
          acc[month].push(sale);
          return acc;
        }, {});

        setSales(groupedSales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchSales();
  }, []);

  // Edit functionality
  const handleEdit = (sale) => {
    setEditingSale({ ...sale });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSale(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSale(prev => ({
      ...prev,
      [name]: name === 'total' || name === 'advance' || name === 'balance' || 
              name === 'framePurchasingPrice' || name === 'LensPurchasingPrice' || 
              name === 'Fiting' || name === 'boxcloth' || name === 'age' ? 
              parseFloat(value) || 0 : value
    }));
  };

  const handleUpdateSale = async () => {
    try {
      await Axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/sales/update/${editingSale._id}`, editingSale);
      const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sales/monthly`);
      
      const groupedSales = response.data.sales.reduce((acc, sale) => {
        const month = moment(sale.date).format("YYYY-MM");
        if (!acc[month]) acc[month] = [];
        acc[month].push(sale);
        return acc;
      }, {});

      setSales(groupedSales);
      setIsEditing(false);
      setEditingSale(null);
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  // PDF Generation (unchanged)
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
  
    Object.keys(sales)
      .sort((a, b) => new Date(a) - new Date(b)) 
      .forEach((month, index) => {
        const monthSales = sales[month];
  
        if (index > 0) doc.addPage();
        doc.text(`Sales Report for ${moment(month).format("MMMM YYYY")}`, 14, 10);
  
        autoTable(doc, {
          startY: 20,
          head: [["Bill No", "Date", "Customer Name", "Age", "Address", "Contact No", "Frame Name", "Glasses", "Total", "Advance", "Balance", "Frame Price", "Lens Price", "Fitting", "Box Cloth", "Profit"]],
          body: monthSales.map(sale => [
            sale.billNo,
            moment(sale.date).format("DD-MM-YYYY"),
            sale.customerName,
            sale.age,
            sale.address,
            sale.contactNo,
            sale.frameName,
            sale.glasses,
            `${sale.total} Rs.`,
            `${sale.advance} Rs.`,
            `${sale.balance} Rs.`,
            `${sale.framePurchasingPrice} Rs.`,
            `${sale.LensPurchasingPrice} Rs.`,
            `${sale.Fiting} Rs.`,
            `${sale.boxcloth} Rs.`,
            `${sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth)} Rs.`
          ]),
          styles: { fontSize: 10 },
        });
  
        const totalFramePrice = monthSales.reduce((sum, sale) => sum + sale.framePurchasingPrice, 0);
        const totalLensPrice = monthSales.reduce((sum, sale) => sum + sale.LensPurchasingPrice, 0);
        const totalFitting = monthSales.reduce((sum, sale) => sum + sale.Fiting, 0);
        const totalBoxCloth = monthSales.reduce((sum, sale) => sum + sale.boxcloth, 0);
        const totalProfit = monthSales.reduce((sum, sale) => sum + (sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth)), 0);
  
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Total Frame Price", "Total Lens Price", "Total Fitting", "Total Box Cloth", "Total Profit"]],
          body: [[`${totalFramePrice} Rs.`, `${totalLensPrice} Rs.`, `${totalFitting} Rs.`, `${totalBoxCloth} Rs.`, `${totalProfit} Rs.`]],
          styles: { fontSize: 12, fontStyle: "bold" },
        });
      });
  
    doc.save("Monthly-Sales-Report.pdf");
  };
  

  // Excel Generation (unchanged)
  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Month", "Bill No", "Date", "Customer Name", "Age", "Address", "Contact No", "Frame Name", "Glasses", "Total", "Advance", "Balance", "Frame Price", "Lens Price", "Fitting", "Box Cloth", "Profit"],
    ];
  
    Object.keys(sales)
      .sort((a, b) => new Date(a) - new Date(b)) 
      .forEach((month) => {
        const monthSales = sales[month];
  
        monthSales.forEach((sale) => {
          worksheetData.push([
            moment(month).format("MMMM YYYY"),
            sale.billNo,
            moment(sale.date).format("YYYY-MM-DD"),
            sale.customerName,
            sale.age,
            sale.address,
            sale.contactNo,
            sale.frameName,
            sale.glasses,
            sale.total,
            sale.advance,
            sale.balance,
            sale.framePurchasingPrice,
            sale.LensPurchasingPrice,
            sale.Fiting,
            sale.boxcloth,
            sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth),
          ]);
        });
      });
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Sales");
    XLSX.writeFile(workbook, "Monthly-Sales-Report.xlsx");
  };
  

  return (
    <div className="max-w-7xl mx-auto mt-20 p-8 bg-gradient-to-r from-gray-100 to-blue-50 shadow-xl rounded-2xl border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 drop-shadow-lg">📊 Monthly Sales Data</h2>

      <div className="flex justify-end gap-4 mb-8">
      <div className="flex justify-end gap-4 mb-8">
 
  <button
    onClick={generatePDF}
    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 
    rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-300"
  >
    Download PDF
  </button>

  <button
    onClick={generateExcel}
    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 
    rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-300"
  >
    Download Excel
  </button>
</div>

      </div>

      {Object.keys(sales).sort().map((month) => {
        const monthSales = sales[month];
        const totalFramePrice = monthSales.reduce((sum, sale) => sum + sale.framePurchasingPrice, 0);
        const totalLensPrice = monthSales.reduce((sum, sale) => sum + sale.LensPurchasingPrice, 0);
        const totalFitting = monthSales.reduce((sum, sale) => sum + sale.Fiting, 0);
        const totalBoxCloth = monthSales.reduce((sum, sale) => sum + sale.boxcloth, 0);
        const totalProfit = monthSales.reduce((sum, sale) => sum + (sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth)), 0);

        return (
          <div key={month} className="mb-12">
            <h3 className="text-3xl font-bold text-gray-700 mb-6">
              📅 {moment(month).format("MMMM YYYY")} Sales
            </h3>

            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    {["Bill No", "Date", "Customer Name", "Age", "Address", "Contact No", "Frame Name", "Glasses", "Total", "Advance", "Balance", "Frame Price", "Lens Price", "Fitting", "Box Cloth", "Profit", "Action"].map((head, i) => (
                      <th key={i} className="border border-gray-300 p-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthSales.map((sale, index) => {
                    const profit = sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth);
                    return (
                      <tr key={index} className="text-center bg-white hover:bg-blue-100 transition duration-200 even:bg-gray-50">
                        <td className="border border-gray-200 p-3">{sale.billNo}</td>
                        <td className="border border-gray-200 p-3">{moment(sale.date).format("YYYY-MM-DD")}</td>
                        <td className="border border-gray-200 p-3">{sale.customerName}</td>
                        <td className="border border-gray-200 p-3">{sale.age}</td>
                        <td className="border border-gray-200 p-3">{sale.address}</td>
                        <td className="border border-gray-200 p-3">{sale.contactNo}</td>
                        <td className="border border-gray-200 p-3">{sale.frameName}</td>
                        <td className="border border-gray-200 p-3">{sale.glasses}</td>
                        <td className="border border-gray-200 p-3">{sale.total} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.advance} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.balance} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.framePurchasingPrice} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.LensPurchasingPrice} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.Fiting} Rs.</td>
                        <td className="border border-gray-200 p-3">{sale.boxcloth} Rs.</td>
                        <td className={`border border-gray-200 p-3 font-semibold ${profit < 0 ? "text-red-500" : "text-green-600"}`}>
                          {profit} Rs.
                        </td>
                        <td className="border border-gray-200 p-3">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-6 bg-white shadow-md rounded-lg text-lg">
              <p><strong>🕶️ Total Frame Price:</strong> {totalFramePrice} Rs.</p>
              <p><strong>🔍 Total Lens Price:</strong> {totalLensPrice} Rs.</p>
              <p><strong>🛠️ Total Fitting Cost:</strong> {totalFitting} Rs.</p>
              <p><strong>📦 Total Box Cloth Cost:</strong> {totalBoxCloth} Rs.</p>
              <p className={`text-xl font-bold ${totalProfit < 0 ? "text-red-600" : "text-green-600"}`}>
                💰 Total Profit: {totalProfit} Rs.
              </p>
            </div>
          </div>
        );
      })}

      {/* Edit Modal with all fields */}
      {isEditing && editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-screen">
            <h3 className="text-2xl font-bold mb-6">Edit Sale (Bill No: {editingSale.billNo})</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={editingSale.customerName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={editingSale.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingSale.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  value={editingSale.contactNo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Product Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Frame Name</label>
                <input
                  type="text"
                  name="frameName"
                  value={editingSale.frameName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Glasses Type</label>
                <input
                  type="text"
                  name="glasses"
                  value={editingSale.glasses}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Financial Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input
                  type="number"
                  name="total"
                  value={editingSale.total}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Advance</label>
                <input
                  type="number"
                  name="advance"
                  value={editingSale.advance}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={editingSale.balance}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Cost Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Frame Purchasing Price</label>
                <input
                  type="number"
                  name="framePurchasingPrice"
                  value={editingSale.framePurchasingPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lens Purchasing Price</label>
                <input
                  type="number"
                  name="LensPurchasingPrice"
                  value={editingSale.LensPurchasingPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fitting</label>
                <input
                  type="number"
                  name="Fiting"
                  value={editingSale.Fiting}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Box Cloth</label>
                <input
                  type="number"
                  name="boxcloth"
                  value={editingSale.boxcloth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSale}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Update Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySales;