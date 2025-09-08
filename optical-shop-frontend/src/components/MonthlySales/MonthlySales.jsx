import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { 
  FaGlasses, 
  FaSearch, 
  FaTools, 
  FaMoneyBillWave,
  FaFilePdf,
  FaFileExcel,
  FaTimes,
  FaSave,
  FaSpinner,
  FaChartBar,
  FaEdit,
  FaChartLine
} from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';
import * as XLSX from "xlsx";
import { useStore } from "../../components/StoreContext/StoreContext";

const MonthlySales = () => {
  const { getMonthlySales, updateSale, loading } = useStore();
  const [sales, setSales] = useState({});
  const [editingSale, setEditingSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const salesData = await getMonthlySales();
      setSales(salesData);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

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
      await updateSale(editingSale._id, editingSale);
      await fetchSalesData();
      setIsEditing(false);
      setEditingSale(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
  
    // Changed sort order here to display most recent month first
    Object.keys(sales)
      .sort((a, b) => new Date(b) - new Date(a)) 
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

  // Excel Generation 
  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Month", "Bill No", "Date", "Customer Name", "Age", "Address", "Contact No", "Frame Name", "Glasses", "Total", "Advance", "Balance", "Frame Price", "Lens Price", "Fitting", "Box Cloth", "Profit"],
    ];
  
    // Changed sort order here to display most recent month first
    Object.keys(sales)
      .sort((a, b) => new Date(b) - new Date(a)) 
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
    <div className="max-w-7xl mx-auto mt-20 p-4 md:p-8 bg-gradient-to-r from-gray-50 to-blue-50 shadow-lg rounded-xl border border-gray-200">
      <div className="group mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 relative inline-block">
          <FaChartBar className="inline mr-3 text-indigo-500" />
          Monthly Sales Data
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-8">
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-4 py-2 md:px-6 md:py-3 bg-indigo-100 text-indigo-700 rounded-lg shadow hover:shadow-md transition-all hover:-translate-y-0.5 border border-indigo-200 flex items-center justify-center gap-2"
        >
          <FaFilePdf className="text-lg" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={generateExcel}
          disabled={loading}
          className="px-4 py-2 md:px-6 md:py-3 bg-green-100 text-green-700 rounded-lg shadow hover:shadow-md transition-all hover:-translate-y-0.5 border border-green-200 flex items-center justify-center gap-2"
        >
          <FaFileExcel className="text-lg" />
          <span>Download Excel</span>
        </button>
      </div>

      {Object.keys(sales)
        .sort((a, b) => new Date(b) - new Date(a)) // Changed sort order here for rendering
        .map(month => {
        const monthSales = sales[month];
        const totalFramePrice = monthSales.reduce((sum, sale) => sum + sale.framePurchasingPrice, 0);
        const totalLensPrice = monthSales.reduce((sum, sale) => sum + sale.LensPurchasingPrice, 0);
        const totalFitting = monthSales.reduce((sum, sale) => sum + sale.Fiting, 0);
        const totalBoxCloth = monthSales.reduce((sum, sale) => sum + sale.boxcloth, 0);
        const totalProfit = monthSales.reduce((sum, sale) => sum + (sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth)), 0);
        const totalSales = monthSales.reduce((sum, sale) => sum + sale.total, 0);

        return (
          <div key={month} className="mb-12">
            <h3 className="text-2xl font-bold text-gray-700 mb-6">
              {moment(month).format("MMMM YYYY")} Sales
              <span className="ml-4 text-lg font-normal text-gray-500">
                {monthSales.length} transactions
              </span>
            </h3>

            <div className="overflow-x-auto rounded-lg shadow-sm mb-6 border border-gray-200">
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    {["Bill No", "Date", "Customer Name", "Age", "Address", "Contact No", "Frame Name", "Glasses", "Total", "Advance", "Balance", "Frame Price", "Lens Price", "Fitting", "Box Cloth", "Profit", "Action"].map((head, i) => (
                      <th key={i} className="p-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthSales.map((sale, index) => {
                    const profit = sale.total - (sale.framePurchasingPrice + sale.LensPurchasingPrice + sale.Fiting + sale.boxcloth);
                    return (
                      <tr 
                        key={index} 
                        className={`border-t border-gray-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="p-3">{sale.billNo}</td>
                        <td className="p-3">{moment(sale.date).format("YYYY-MM-DD")}</td>
                        <td className="p-3">{sale.customerName}</td>
                        <td className="p-3">{sale.age}</td>
                        <td className="p-3">{sale.address}</td>
                        <td className="p-3">{sale.contactNo}</td>
                        <td className="p-3">{sale.frameName}</td>
                        <td className="p-3">{sale.glasses}</td>
                        <td className="p-3">{sale.total} Rs.</td>
                        <td className="p-3">{sale.advance} Rs.</td>
                        <td className="p-3">{sale.balance} Rs.</td>
                        <td className="p-3">{sale.framePurchasingPrice} Rs.</td>
                        <td className="p-3">{sale.LensPurchasingPrice} Rs.</td>
                        <td className="p-3">{sale.Fiting} Rs.</td>
                        <td className="p-3">{sale.boxcloth} Rs.</td>
                        <td className={`p-3 font-semibold ${profit < 0 ? "text-red-500" : "text-green-600"}`}>
                          {profit} Rs.
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-blue-500" />
                    <span className="font-medium">Total Sales</span>
                  </div>
                  <span className="font-bold">{totalSales} Rs.</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaTools className="text-purple-500" />
                    <span className="font-medium">Total Costs</span>
                  </div>
                  <span className="font-bold">{totalFramePrice + totalLensPrice + totalFitting + totalBoxCloth} Rs.</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                totalProfit < 0 ? "bg-red-50" : "bg-green-50"
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaChartLine className={totalProfit < 0 ? "text-red-500" : "text-green-500"} />
                    <span className="font-medium">Net Profit</span>
                  </div>
                  <span className={`font-bold ${
                    totalProfit < 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    {totalProfit} Rs.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <FaGlasses className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Total Frame Price</p>
                    <p className="font-medium">{totalFramePrice} Rs.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaSearch className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Total Lens Price</p>
                    <p className="font-medium">{totalLensPrice} Rs.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaTools className="text-yellow-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Total Fitting Cost</p>
                    <p className="font-medium">{totalFitting} Rs.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GiClothes className="text-green-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Total Box/Cloth Cost</p>
                    <p className="font-medium">{totalBoxCloth} Rs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isEditing && editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Edit Sale (Bill No: {editingSale.billNo})
                </h3>
                <button 
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Customer Name", name: "customerName", type: "text" },
                  { label: "Bill No", name: "billNo", type: "text" },
                  { label: "Date", name: "date", type: "date" },
                  { label: "Age", name: "age", type: "number" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Contact No", name: "contactNo", type: "text" },
                  { label: "Frame Name", name: "frameName", type: "text" },
                  { label: "Glasses Type", name: "glasses", type: "text" },
                  { label: "Total Amount", name: "total", type: "number" },
                  { label: "Advance Paid", name: "advance", type: "number" },
                  { label: "Balance Due", name: "balance", type: "number" },
                  { label: "Frame Cost", name: "framePurchasingPrice", type: "number" },
                  { label: "Lens Cost", name: "LensPurchasingPrice", type: "number" },
                  { label: "Fitting Charges", name: "Fiting", type: "number" },
                  { label: "Box/Cloth Cost", name: "boxcloth", type: "number" }
                ].map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.type === 'date' 
                        ? moment(editingSale[field.name]).format('YYYY-MM-DD') 
                        : editingSale[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSale}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Sale
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySales;