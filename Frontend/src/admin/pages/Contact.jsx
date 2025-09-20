import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, Typography, Button, Grid,
  Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Load contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('❌ Lỗi load dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Thay đổi status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${id}`, { status });
      fetchContacts();
    } catch (err) {
      console.error('❌ Lỗi cập nhật status:', err);
      alert('Lỗi khi cập nhật status');
    }
  };

  // Xóa contact
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá contact này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        console.error('❌ Lỗi xoá contact:', err);
        alert('Lỗi khi xoá contact');
      }
    }
  };

  // Mở dialog Reply
  const handleOpenReply = (contact) => {
    setCurrentContact(contact);
    setReplyMessage('');
    setOpenReply(true);
  };

  // Gửi email phản hồi
  const handleSendReply = async () => {
    try {
      await axios.post(`http://localhost:5000/api/contacts/${currentContact._id}/reply`, { message: replyMessage });
      alert('Đã gửi phản hồi thành công');
      setOpenReply(false);
    } catch (err) {
      console.error('❌ Lỗi khi gửi phản hồi:', err);
      alert('Lỗi khi gửi phản hồi');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Quản lý Liên hệ</Typography>

      <Grid container spacing={2}>
        {contacts.map(contact => (
          <Grid item xs={12} md={6} key={contact._id}>
            <Card variant="outlined" sx={{ borderColor: contact.status === 'new' ? 'red' : 'grey' }}>
              <CardContent>
                <Typography variant="h6">{contact.name}</Typography>
                <Typography variant="body2" color="text.secondary">{contact.email}</Typography>
                {contact.phone && <Typography variant="body2">Phone: {contact.phone}</Typography>}
                {contact.subject && <Typography variant="body2">Subject: {contact.subject}</Typography>}

                <Box mt={1}>
                  <Typography variant="subtitle2">Message:</Typography>
                  <Typography variant="body2">{contact.message}</Typography>
                </Box>

                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Typography>Status:</Typography>
                  <Select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                  </Select>
                </Box>

                <Typography mt={1} variant="caption">
                  Created At: {new Date(contact.createdAt).toLocaleString()}
                </Typography>

                <Box mt={1} display="flex" gap={1}>
                  <Button size="small" color="primary" onClick={() => handleOpenReply(contact)}>Reply</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(contact._id)}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Reply */}
      <Dialog open={openReply} onClose={() => setOpenReply(false)}>
        <DialogTitle>Reply to {currentContact?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReply(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendReply}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactManagement;
