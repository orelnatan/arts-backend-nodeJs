// routes/image-bb.route.js
const express = require('express');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

const IMGBB_API_KEY = "a06872ef72c0b074aaa627abfe08f9ea";

router.post('/upload-image', authenticateToken, async (req, res) => {
  try {
    const { image } = req.body; // Pure JSON base64 string from frontend
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided.' });
    }

    // Standard URL-encoded request to ImgBB
    const payload = new URLSearchParams({ image });

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: payload,
    });

    const result = await imgbbResponse.json();

    return res.status(200).json({
      success: true,
      data: {
        display_url: result.data.display_url
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

module.exports = router;