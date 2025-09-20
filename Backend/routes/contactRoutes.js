<<<<<<< HEAD
// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

=======
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
require('dotenv').config(); // đọc .env

// POST: tạo contact mới
>>>>>>> b32aa75 (update code)
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

<<<<<<< HEAD
module.exports = router;
=======
// GET: lấy tất cả contact
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('❌ Lỗi khi lấy contacts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: lấy contact theo ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact không tồn tại' });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: cập nhật contact (vd: status)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Contact không tồn tại' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: xóa contact
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Contact không tồn tại' });
    res.json({ message: 'Đã xóa contact' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/contacts/:id/reply
router.post('/:id/reply', async (req, res) => {
  const { message } = req.body; // nội dung phản hồi admin
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact không tồn tại' });

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail ví dụ
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: 'Phản hồi từ Admin',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Đã gửi email phản hồi thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi gửi email' });
  }
});
module.exports = router;

>>>>>>> b32aa75 (update code)
