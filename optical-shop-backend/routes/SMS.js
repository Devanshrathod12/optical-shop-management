const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Phone or message missing' });
  }

  try {
    const apiUrl = 'https://api.cp.cx/webexconnect/v1/messages';

    const payload = {
      to: phone,
      body: message,
      from: process.env.WEBEX_SENDER,
      channel: 'sms',
    };

    const headers = {
      Authorization: `Bearer ${process.env.WEBEX_API_KEY}`,
      'Content-Type': 'application/json',
    };

    console.log(' Payload being sent:', payload);
    console.log('Headers being sent:', headers);

    const response = await axios.post(apiUrl, payload, { headers });

    console.log(" Webex API response:", response.data);

    if (response.data?.status === 'queued') {
      return res.status(200).json({ success: true, data: response.data });
    } else {
      return res.status(400).json({ success: false, error: response.data });
    }
  } catch (error) {
    console.error(" Webex API Error:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error(" Data:", error.response.data);
    } else if (error.request) {
      console.error(" No response received. Request was:", error.request);
    } else {
      console.error(" Error setting up the request:", error.message);
    }

    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message || 'Unknown Error',
    });
  }
});

module.exports = router;
