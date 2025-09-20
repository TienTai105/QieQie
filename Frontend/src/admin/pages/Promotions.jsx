import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Switch, FormControlLabel, IconButton, Card, CardContent, Typography, Grid
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error('❌ Lỗi load dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSave = async () => {
    try {
      if (selectedPromo._id) {
        await axios.put(`/api/promotions/${selectedPromo._id}`, selectedPromo);
      } else {
        await axios.post('/api/promotions', selectedPromo);
      }
      setOpenDialog(false);
      fetchPromotions();
    } catch (err) {
      console.error('❌ Lỗi lưu dữ liệu:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá khuyến mãi này?')) {
      await axios.delete(`/api/promotions/${id}`);
      fetchPromotions();
    }
  };

  const handleAddField = (field) => {
    setSelectedPromo({ ...selectedPromo, [field]: [...(selectedPromo[field] || []), ''] });
  };

  const handleRemoveField = (field, index) => {
    const arr = [...selectedPromo[field]];
    arr.splice(index, 1);
    setSelectedPromo({ ...selectedPromo, [field]: arr });
  };

  const handleChangeField = (field, index, value) => {
    const arr = [...selectedPromo[field]];
    arr[index] = value;
    setSelectedPromo({ ...selectedPromo, [field]: arr });
  };

  return (
    <Box p={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSelectedPromo({ title: '', shortDescription: '', conditions: [], notes: [], image: '', active: true })}
      >
        Thêm Khuyến Mãi
      </Button>

      <Grid container spacing={2} mt={2}>
        {promotions.map((p) => (
          <Grid item xs={12} md={6} key={p._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.title}</Typography>
                <Typography variant="body2" color="text.secondary">{p.shortDescription}</Typography>
                {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', marginTop: 8 }} />}
                
                <Box mt={1}>
                  <Typography variant="subtitle2">Conditions:</Typography>
                  {p.conditions?.map((c, idx) => (
                    <Typography key={idx} variant="body2">• {c}</Typography>
                  ))}
                </Box>

                <Box mt={1}>
                  <Typography variant="subtitle2">Notes:</Typography>
                  {p.notes?.map((n, idx) => (
                    <Typography key={idx} variant="body2">• {n}</Typography>
                  ))}
                </Box>

                <Typography mt={1}>Active: {p.active ? 'Yes' : 'No'}</Typography>
                <Typography>Created At: {new Date(p.createdAt).toLocaleString()}</Typography>

                <Box mt={1}>
                  <Button size="small" onClick={() => { setSelectedPromo(p); setOpenDialog(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(p._id)}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Add/Edit */}
      <Dialog open={!!openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPromo?._id ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={selectedPromo?.title || ''}
            onChange={e => setSelectedPromo({ ...selectedPromo, title: e.target.value })}
          />
          <TextField
            label="Short Description"
            fullWidth
            margin="dense"
            value={selectedPromo?.shortDescription || ''}
            onChange={e => setSelectedPromo({ ...selectedPromo, shortDescription: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="dense"
            value={selectedPromo?.image || ''}
            onChange={e => setSelectedPromo({ ...selectedPromo, image: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={selectedPromo?.active || false}
                onChange={e => setSelectedPromo({ ...selectedPromo, active: e.target.checked })}
              />
            }
            label="Active"
          />

          <Box mt={2}>
            <strong>Conditions:</strong>
            {selectedPromo?.conditions?.map((cond, idx) => (
              <Box key={idx} display="flex" alignItems="center" mt={1}>
                <TextField
                  fullWidth
                  value={cond}
                  onChange={e => handleChangeField('conditions', idx, e.target.value)}
                />
                <IconButton color="error" onClick={() => handleRemoveField('conditions', idx)}><Remove /></IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={() => handleAddField('conditions')}>Add Condition</Button>
          </Box>

          <Box mt={2}>
            <strong>Notes:</strong>
            {selectedPromo?.notes?.map((note, idx) => (
              <Box key={idx} display="flex" alignItems="center" mt={1}>
                <TextField
                  fullWidth
                  value={note}
                  onChange={e => handleChangeField('notes', idx, e.target.value)}
                />
                <IconButton color="error" onClick={() => handleRemoveField('notes', idx)}><Remove /></IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={() => handleAddField('notes')}>Add Note</Button>
          </Box>

          <Box mt={2}>
            <TextField
              label="Created At"
              fullWidth
              margin="dense"
              value={selectedPromo?.createdAt ? new Date(selectedPromo.createdAt).toLocaleString() : ''}
              InputProps={{ readOnly: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagement;
