// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ message: 'Đã lưu liên hệ thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lưu liên hệ.' });
  }
});

module.exports = router;
