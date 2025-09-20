import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Lỗi load dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add / Edit
  const handleSave = async () => {
    try {
      if (selectedUser._id) {
        await axios.put(`/api/users/${selectedUser._id}`, selectedUser);
      } else {
        await axios.post('/api/users', selectedUser);
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      console.error('❌ Lỗi lưu dữ liệu:', err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá user này?')) {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <Box p={3}>
      <Button variant="contained" color="primary" onClick={() => { setSelectedUser({}); setOpenDialog(true); }}>
        Thêm User
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => { setSelectedUser(user); setOpenDialog(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedUser?._id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          {['name','username','email','phone','role'].map(field => (
            <TextField
              key={field}
              margin="dense"
              label={field}
              fullWidth
              value={selectedUser?.[field] || ''}
              onChange={e => setSelectedUser({ ...selectedUser, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
