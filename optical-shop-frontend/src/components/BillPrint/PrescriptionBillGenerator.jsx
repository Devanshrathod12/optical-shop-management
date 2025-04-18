import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 70, // Increased bottom padding for fixed footer
    paddingHorizontal: 30, // Use horizontal padding
    fontFamily: 'Helvetica',
    fontSize: 10, // Default font size for the page
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '2px solid #3498db',
    paddingBottom: 10,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  address: {
    fontSize: 10,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  // Style for structured fields (Label: Value)
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start', // Better alignment if value wraps
  },
  label: {
    fontWeight: 'bold',
    width: 120, // Fixed width for labels
    fontSize: 10,
    marginRight: 5,
  },
  value: {
    fontSize: 10,
    flex: 1, // Allow value to take remaining space
    // Optional: Add dotted line if needed like previous example
    // borderBottom: '1px dotted #999',
    // paddingBottom: 2,
  },
  // Style for BillNo/Date row
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 10,
    fontWeight: 'bold',
     border: '1px solid #ccc', // Add border around this row
     padding: 5,
     borderRadius: 3,
  },
  // Table styles remain largely the same
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderRight: '1px solid #000',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#f0f0f0', // Header background
  },
  tableCol: {
    width: '20%',
    borderRight: '1px solid #000',
    padding: 5,
    textAlign: 'center',
    fontSize: 10,
  },
  tableColLast: { // Style for the last column to remove right border if needed
     width: '20%',
     padding: 5,
     textAlign: 'center',
     fontSize: 10,
  },
  // Checkbox styles (similar to previous example)
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    padding: 5,
    border: '1px solid #eee',
    borderRadius: 3,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
     fontSize: 10,
     marginLeft: 5,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1px solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  checked: {
    width: 6,
    height: 6,
    backgroundColor: '#000',
  },
  // Amount section styles
  amountSection: {
    marginTop: 20,
    paddingTop: 10,
  },
  amountRow: { // For aligning label and value (e.g., Total Amount: 100.00)
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 3,
    borderBottom: '1px dotted #999', // Add line like previous example
  },
   amountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountValue: {
    fontSize: 10,
  },
  paymentMethod: { // Renamed from paymentMethod Section to avoid conflict
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    border: '1px solid #ddd',
  },
  // Footer style (Updated for fixed positioning)
  footer: {
    position: 'absolute', // Use absolute for fixed alternative in some renderers if 'fixed' prop isn't enough
    bottom: 30,       // Distance from bottom
    left: 30,         // Match page horizontal padding
    right: 30,        // Match page horizontal padding
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
    borderTop: '1px solid #ccc',
    paddingTop: 5,
  },
  // Watermark style (Updated for centering)
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    color: 'rgba(52, 152, 219, 0.08)', // Lighter theme color
    fontSize: 60,
    fontWeight: 'bold',
    transform: 'translate(-50%, -50%) rotate(-45deg)', // Centering transform
    zIndex: -1, // Behind content
  },
  currencySymbol: {
    marginRight: 2,
    fontSize: 10,
  },
});

// PDF Document Component (Updated)
const MyDocument = ({ customerData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
        {/* Watermark View */}
        <View style={styles.watermark} fixed>
           <Text>SHREE VINAYAK OPTICAL</Text>
        </View>

        {/* Main Content Wrapper */}
        <View>
          <View style={styles.header}>
            <Text style={styles.clinicName}>SHREE VINAYAK OPTICAL</Text>
            <Text style={styles.tagline}>Opticians & Contact Lenses</Text>
            <Text style={styles.tagline}>Enhancing your Vision with style</Text>
            <Text style={styles.address}>A 21-A, Silicon City Branch, INDORE (M.P.)</Text>
            <Text style={styles.address}>Mob. : 8871951440, 7724012193</Text>
          </View>

          {/* Bill No and Date Row */}
          <View style={styles.metaRow}>
            <Text>Bill No: {customerData.billNo || 'N/A'}</Text>
            <Text>Date: {customerData.date || 'N/A'}</Text>
          </View>

          {/* Customer Details Section */}
          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>Customer Details</Text> Optional Title */}
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{customerData.name || '-'}</Text>
            </View>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{customerData.address || '-'}</Text>
            </View>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.value}>{customerData.age || '-'}</Text>
            </View>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Contact No:</Text>
                <Text style={styles.value}>{customerData.contactNo || '-'}</Text>
            </View>
          </View>

          {/* Prescription Table */}
          <View style={styles.table}>
             {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Px</Text></View>
              <View style={styles.tableColHeader}><Text>SPH</Text></View>
              <View style={styles.tableColHeader}><Text>CYL</Text></View>
              <View style={styles.tableColHeader}><Text>AXIS</Text></View>
              <View style={[styles.tableColHeader, { borderRightWidth: 0 }]}><Text>VIA</Text></View>
            </View>
             {/* Right Eye */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>Right Eye</Text></View>
              <View style={styles.tableCol}><Text>{customerData.rightSph || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{customerData.rightCyl || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{customerData.rightAxis || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{customerData.rightVia || '-'}</Text></View>
            </View>
             {/* Left Eye */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>Left Eye</Text></View>
              <View style={styles.tableCol}><Text>{customerData.leftSph || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{customerData.leftCyl || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{customerData.leftAxis || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{customerData.leftVia || '-'}</Text></View>
            </View>
             {/* Addition */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>Addition</Text></View>
              <View style={styles.tableCol}><Text>{customerData.addition || '-'}</Text></View>
              <View style={styles.tableCol}><Text>-</Text></View>
              <View style={styles.tableCol}><Text>-</Text></View>
              <View style={styles.tableColLast}><Text>-</Text></View>
            </View>
          </View>

          {/* Checkbox Section */}
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <View style={styles.checkbox}>{customerData.singleVision && <View style={styles.checked} />}</View>
              <Text style={styles.checkboxLabel}>Single Vision</Text>
            </View>
            <View style={styles.checkboxItem}>
              <View style={styles.checkbox}>{customerData.bifocal && <View style={styles.checked} />}</View>
              <Text style={styles.checkboxLabel}>Bifocal</Text>
            </View>
            <View style={styles.checkboxItem}>
              <View style={styles.checkbox}>{customerData.progressive && <View style={styles.checked} />}</View>
              <Text style={styles.checkboxLabel}>Progressive</Text>
            </View>
            <View style={styles.checkboxItem}>
              <View style={styles.checkbox}>{customerData.contactLense && <View style={styles.checked} />}</View>
              <Text style={styles.checkboxLabel}>Contact Lens</Text>
            </View>
          </View>

          {/* Frame/Glasses Section */}
          <View style={styles.section}>
             <View style={styles.fieldContainer}>
                <Text style={styles.label}>Frame:</Text>
                <Text style={styles.value}>{customerData.frame || '-'}</Text>
             </View>
             <View style={styles.fieldContainer}>
                <Text style={styles.label}>Glasses:</Text>
                <Text style={styles.value}>{customerData.glasses || '-'}</Text>
             </View>
          </View>

          {/* Amount Section */}
          <View style={styles.amountSection}>
             {/* <Text style={styles.sectionTitle}>Payment Details</Text> Optional Title */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total Amount:</Text>
              <Text style={styles.amountValue}>
                <Text style={styles.currencySymbol}>₹</Text>
                {parseFloat(customerData.totalAmount || 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Advance Amount:</Text>
              <Text style={styles.amountValue}>
                <Text style={styles.currencySymbol}>₹</Text>
                {parseFloat(customerData.advanceAmount || 0).toFixed(2)}
              </Text>
            </View>

            {/* --- Corrected Advance Payment Method and Txn ID --- */}
            { parseFloat(customerData.advanceAmount || 0) > 0 && (
              <View style={styles.fieldContainer}>
                 <Text style={styles.label}>Adv. Method:</Text>
                 <Text style={styles.value}>
                     {customerData.advancePaymentMethod === 'online' ? 'Online' : 'Cash'}
                     {customerData.advancePaymentMethod === 'online' && customerData.advanceTransactionId &&
                       ` (Txn ID: ${customerData.advanceTransactionId})` // Correct syntax
                     }
                 </Text>
               </View>
            )}

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Balance Amount:</Text>
              <Text style={styles.amountValue}>
                <Text style={styles.currencySymbol}>₹</Text>
                {parseFloat(customerData.balanceAmount || 0).toFixed(2)}
              </Text>
            </View>

             {/* --- Corrected Balance Payment Method and Txn ID --- */}
             {/* Only show balance payment details if balance > 0 */}
             { parseFloat(customerData.balanceAmount || 0) > 0 && (
                <View style={styles.paymentMethod}>
                   <View style={styles.fieldContainer}>
                     <Text style={styles.label}>Bal. Method:</Text>
                     <Text style={styles.value}>
                         {customerData.paymentMethod === 'online' ? 'Online' : 'Cash'}
                         {customerData.paymentMethod === 'online' && customerData.transactionId &&
                           ` (Txn ID: ${customerData.transactionId})` // Correct syntax
                         }
                     </Text>
                   </View>
                </View>
             )}
          </View>
        </View>

      {/* Footer View (Fixed) */}
      {/* --- ADDED fixed PROP --- */}
      <View style={styles.footer} fixed>
        <Text>Thank you for choosing Shree Vinayak Optical</Text>
        <Text>For any queries, please contact: 8871951440</Text>
      </View>
    </Page>
  </Document>
);

const PrescriptionBillGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    address: "",
    date: new Date().toISOString().split('T')[0],
    billNo: `SVO${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
    manualBillNo: false,
    age: "",
    // Right Eye
    rightSph: "",
    rightCyl: "",
    rightAxis: "",
    rightVia: "",
    // Left Eye
    leftSph: "",
    leftCyl: "",
    leftAxis: "",
    leftVia: "",
    // Addition
    addition: "",
    // Lens Type
    singleVision: false,
    bifocal: false,
    progressive: false,
    contactLense: false,
    // Frame and Glasses
    frame: "",
    glasses: "",
    // Payment
    paymentMethod: "cash",
    transactionId: "",
    // Advance Payment
    advancePaymentMethod: "cash",
    advanceTransactionId: "",
    // Amounts
    totalAmount: "",
    advanceAmount: "",
    balanceAmount: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special case for manual bill number toggle
    if (name === "manualBillNo") {
      setFormData(prev => ({
        ...prev,
        manualBillNo: checked
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-calculate balance when relevant fields change
    if (name === 'totalAmount' || name === 'advanceAmount') {
      const total = parseFloat(name === 'totalAmount' ? value : formData.totalAmount) || 0;
      const advance = parseFloat(name === 'advanceAmount' ? value : formData.advanceAmount) || 0;
      const balance = total - advance;
      setFormData(prev => ({
        ...prev,
        balanceAmount: balance.toFixed(2)
      }));
    }
  };

  const handlePaymentMethodChange = (field, method) => {
    if (field === 'balance') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: method,
        transactionId: method === 'cash' ? '' : prev.transactionId
      }));
    } else if (field === 'advance') {
      setFormData(prev => ({
        ...prev,
        advancePaymentMethod: method,
        advanceTransactionId: method === 'cash' ? '' : prev.advanceTransactionId
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">SHREE VINAYAK OPTICAL</h2>
        <p className="text-gray-600 italic">Opticians & Contact Lenses</p>
        <p className="text-sm text-gray-500">A 21-A, Silicon City Branch, INDORE (M.P.)</p>
        <p className="text-sm text-gray-500">Mob. : 8871951440, 7724012193</p>
      </div>
      
      <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">Prescription Bill Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Bill No</label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="manualBillNo"
              checked={formData.manualBillNo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 mr-2"
            />
            <span className="text-sm text-gray-600">Enter bill number manually</span>
          </div>
          {formData.manualBillNo ? (
            <input
              type="text"
              name="billNo"
              value={formData.billNo}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bill number"
            />
          ) : (
            <div className="flex">
              <input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleChange}
                className="w-full p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
              <button 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  billNo: `SVO${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`
                }))}
                className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600 transition-colors"
              >
                New
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Customer Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Contact Number*</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Prescription Details</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-center border">Eye</th>
                <th className="p-2 text-center border">SPH</th>
                <th className="p-2 text-center border">CYL</th>
                <th className="p-2 text-center border">AXIS</th>
                <th className="p-2 text-center border">VIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border font-medium">Right Eye</td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="rightSph"
                    value={formData.rightSph}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="rightCyl"
                    value={formData.rightCyl}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="rightAxis"
                    value={formData.rightAxis}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="rightVia"
                    value={formData.rightVia}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border font-medium">Left Eye</td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="leftSph"
                    value={formData.leftSph}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="leftCyl"
                    value={formData.leftCyl}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="leftAxis"
                    value={formData.leftAxis}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="leftVia"
                    value={formData.leftVia}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border font-medium">Addition</td>
                <td className="p-1 border">
                  <input
                    type="text"
                    name="addition"
                    value={formData.addition}
                    onChange={handleChange}
                    className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                    placeholder="-"
                  />
                </td>
                <td className="p-2 border text-center">-</td>
                <td className="p-2 border text-center">-</td>
                <td className="p-2 border text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            name="singleVision" 
            checked={formData.singleVision} 
            onChange={handleChange} 
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span>Single Vision</span>
        </label>
        <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            name="bifocal" 
            checked={formData.bifocal} 
            onChange={handleChange} 
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span>Bifocal</span>
        </label>
        <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            name="progressive" 
            checked={formData.progressive} 
            onChange={handleChange} 
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span>Progressive</span>
        </label>
        <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            name="contactLense" 
            checked={formData.contactLense} 
            onChange={handleChange} 
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span>Contact Lense</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Frame Details</label>
          <input
            type="text"
            name="frame"
            value={formData.frame}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Frame brand/model"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Glasses Details</label>
          <input
            type="text"
            name="glasses"
            value={formData.glasses}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Glasses type/coating"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Total Amount (₹)*</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full pl-8 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Advance Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
            <input
              type="number"
              name="advanceAmount"
              value={formData.advanceAmount}
              onChange={handleChange}
              className="w-full pl-8 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Balance Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
            <input
              type="number"
              name="balanceAmount"
              value={formData.balanceAmount}
              className="w-full pl-8 p-2 border rounded bg-gray-100"
              placeholder="0.00"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Advance Payment Section */}
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Advance Payment Details</h3>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="advancePaymentMethod"
              checked={formData.advancePaymentMethod === 'cash'}
              onChange={() => handlePaymentMethodChange('advance', 'cash')}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span>Cash</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="advancePaymentMethod"
              checked={formData.advancePaymentMethod === 'online'}
              onChange={() => handlePaymentMethodChange('advance', 'online')}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span>Online Payment</span>
          </label>
        </div>
        {formData.advancePaymentMethod === 'online' && (
          <div className="mt-2">
            <label className="block mb-1 font-medium">Advance Transaction ID</label>
            <input
              type="text"
              name="advanceTransactionId"
              value={formData.advanceTransactionId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Transaction reference number"
            />
          </div>
        )}
      </div>

      {/* Balance Payment Section */}
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Balance Payment Method*</h3>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              checked={formData.paymentMethod === 'cash'}
              onChange={() => handlePaymentMethodChange('balance', 'cash')}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span>Cash</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              checked={formData.paymentMethod === 'online'}
              onChange={() => handlePaymentMethodChange('balance', 'online')}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span>Online Payment</span>
          </label>
        </div>
        {formData.paymentMethod === 'online' && (
          <div className="mt-2">
            <label className="block mb-1 font-medium">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Transaction reference number"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <PDFDownloadLink
          document={<MyDocument customerData={formData} />}
          fileName={`ShreeVinayakOptical_Bill_${formData.billNo}.pdf`}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
        >
          {({ loading }) => (
            <>
              {loading ? (
                'Generating PDF...'
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Bill
                </>
              )}
            </>
          )}
        </PDFDownloadLink>
        
        <button 
          onClick={() => {
            setFormData({
              name: "",
              contactNo: "",
              address: "",
              date: new Date().toISOString().split('T')[0],
              billNo: `SVO${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
              manualBillNo: false,
              age: "",
              rightSph: "",
              rightCyl: "",
              rightAxis: "",
              rightVia: "",
              leftSph: "",
              leftCyl: "",
              leftAxis: "",
              leftVia: "",
              addition: "",
              singleVision: false,
              bifocal: false,
              progressive: false,
              contactLense: false,
              frame: "",
              glasses: "",
              paymentMethod: "cash",
              transactionId: "",
              advancePaymentMethod: "cash",
              advanceTransactionId: "",
              totalAmount: "",
              advanceAmount: "",
              balanceAmount: ""
            });
          }}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Form
        </button>
      </div>
    </div>
  );
};

export default PrescriptionBillGenerator;