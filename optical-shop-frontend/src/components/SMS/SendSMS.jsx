import React, { useState } from 'react';
import axios from 'axios';

const SendSMS = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/sms/send', {
        phone,
        message
      });

      if (res.data.success) {
        setStatus('📩 SMS Sent Successfully!');
      } else {
        setStatus('❌ Failed to send SMS.');
      }
    } catch (err) {
      console.error(err);
      setStatus('⚠️ Error sending SMS.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-36 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">📲 Send SMS</h2>

      <input
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>

      {status && <p className="text-green-600 font-medium">{status}</p>}
    </div>
  );
};

export default SendSMS;
