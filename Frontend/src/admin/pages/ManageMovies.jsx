<<<<<<< HEAD

=======
>>>>>>> b32aa75 (update code)
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Switch, FormControlLabel, Chip, Stack
} from '@mui/material';
import axios from 'axios';

<<<<<<< HEAD
=======
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

>>>>>>> b32aa75 (update code)
const defaultMovie = {
  title: '',
  duration: '',
  poster: '',
  description: '',
  actors: '',
  director: '',
  language: '',
  releaseDate: '',
  trailerUrl: '',
<<<<<<< HEAD
  ageRestriction: {
    age: '',
    reason: ''
  },
  genres: [],
  comingsoon: false,
=======
  ageRestriction: { age: '', reason: '' },
  genres: [],
  comingSoon: false,
>>>>>>> b32aa75 (update code)
  showing: false,
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState(defaultMovie);

<<<<<<< HEAD
  const loadMovies = async () => {
    const res = await axios.get('/api/movies');
    setMovies(res.data);
=======
  // ✅ Load movies
  const loadMovies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/movies?limit=1000`);
      setMovies(res.data.items || res.data || []); // tương thích API mới
    } catch (err) {
      console.error("Lỗi khi tải danh sách phim:", err);
    }
>>>>>>> b32aa75 (update code)
  };

  useEffect(() => {
    loadMovies();
  }, []);

<<<<<<< HEAD
  const handleOpen = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setForm(movie);
=======
  // ✅ Mở dialog thêm/sửa phim
  const handleOpen = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setForm({
        ...movie,
        ageRestriction: movie.ageRestriction
          ? {
            age: movie.ageRestriction.age || '',
            reason: movie.ageRestriction.reason || '',
          }
          : { age: '', reason: '' },
        genres: Array.isArray(movie.genres)
          ? movie.genres
          : movie.genres
            ? movie.genres.split(',').map(v => v.trim())
            : [],
      });
>>>>>>> b32aa75 (update code)
    } else {
      setEditingMovie(null);
      setForm(defaultMovie);
    }
    setOpen(true);
  };

<<<<<<< HEAD
=======

>>>>>>> b32aa75 (update code)
  const handleClose = () => {
    setOpen(false);
    setForm(defaultMovie);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('ageRestriction.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        ageRestriction: { ...prev.ageRestriction, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGenresChange = (e) => {
<<<<<<< HEAD
    const values = e.target.value.split(',').map((v) => v.trim());
    setForm((prev) => ({ ...prev, genres: values }));
=======
    setForm((prev) => ({
      ...prev,
      genres: e.target.value.split(',').map(v => v.trim()).filter(Boolean),
    }));
>>>>>>> b32aa75 (update code)
  };

  const handleSubmit = async () => {
    try {
<<<<<<< HEAD
      if (editingMovie) {
        await axios.put(`/api/movies/${editingMovie._id}`, form);
      } else {
        await axios.post('/api/movies', form);
      }
      loadMovies();
      handleClose();
    } catch (err) {
      console.error('Lỗi khi lưu phim:', err);
=======
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingMovie) {
        await axios.put(`${API_BASE}/api/movies/${editingMovie._id}`, form, config);
      } else {
        await axios.post(`${API_BASE}/api/movies`, form, config);
      }
      await loadMovies();
      handleClose();
    } catch (err) {
      console.error('Lỗi khi lưu phim:', err);
      alert("Không thể lưu phim. Vui lòng kiểm tra dữ liệu hoặc đăng nhập lại.");
>>>>>>> b32aa75 (update code)
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá phim này?')) return;
    try {
<<<<<<< HEAD
      await axios.delete(`/api/movies/${id}`);
=======
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
>>>>>>> b32aa75 (update code)
      loadMovies();
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>🎬 Quản lý Phim</Typography>
      <Button variant="contained" onClick={() => handleOpen()}>➕ Thêm phim</Button>

<<<<<<< HEAD
=======
      {/* Danh sách phim */}
>>>>>>> b32aa75 (update code)
      <Box mt={3}>
        {movies.map((movie) => (
          <Box key={movie._id} p={2} mb={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6">{movie.title}</Typography>
<<<<<<< HEAD
            <Typography>Thời lượng: {movie.duration} phút</Typography>
            <Typography>Đạo diễn: {movie.director}</Typography>
            <Typography>Ngày phát hành: {movie.releaseDate}</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {movie.genres.map((g, i) => <Chip key={i} label={g} />)}
=======
            <Typography>⏱ {movie.duration || 'N/A'} phút</Typography>
            <Typography>🎥 {movie.director}</Typography>
            <Typography>📅 {movie.releaseDate}</Typography>
            <Typography color={movie.showing ? "green" : movie.comingSoon ? "orange" : "textSecondary"}>
              {movie.showing
                ? "🎬 Đang chiếu"
                : movie.comingSoon
                  ? "📢 Sắp chiếu"
                  : "⏳ Không xác định"}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {Array.isArray(movie.genres) && movie.genres.length > 0
                ? movie.genres.map((g, i) => <Chip key={i} label={g} />)
                : <Typography variant="body2" color="textSecondary">Chưa có thể loại</Typography>}
>>>>>>> b32aa75 (update code)
            </Stack>
            <Stack direction="row" spacing={1} mt={2}>
              <Button variant="outlined" onClick={() => handleOpen(movie)}>Sửa</Button>
              <Button variant="outlined" color="error" onClick={() => handleDelete(movie._id)}>Xoá</Button>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingMovie ? '✏️ Sửa phim' : '➕ Thêm phim'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Tên phim" name="title" value={form.title} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Thời lượng (phút)" name="duration" type="number" value={form.duration} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Poster (URL hoặc path)" name="poster" value={form.poster} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Mô tả" name="description" value={form.description} onChange={handleChange} multiline rows={3} />
          <TextField fullWidth margin="dense" label="Diễn viên (phân cách dấu phẩy)" name="actors" value={form.actors} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Đạo diễn" name="director" value={form.director} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Ngôn ngữ" name="language" value={form.language} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Ngày phát hành (yyyy-mm-dd)" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Trailer URL" name="trailerUrl" value={form.trailerUrl} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Độ tuổi giới hạn" name="ageRestriction.age" value={form.ageRestriction.age} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Lý do giới hạn" name="ageRestriction.reason" value={form.ageRestriction.reason} onChange={handleChange} />
<<<<<<< HEAD
          <TextField fullWidth margin="dense" label="Thể loại (cách nhau dấu phẩy)" name="genres" value={form.genres.join(', ')} onChange={handleGenresChange} />
          <FormControlLabel control={<Switch checked={form.showing} onChange={handleSwitch} name="showing" />} label="Đang chiếu" />
          <FormControlLabel control={<Switch checked={form.comingsoon} onChange={handleSwitch} name="comingsoon" />} label="Sắp chiếu" />
=======
          <TextField
            fullWidth
            margin="dense"
            label="Thể loại (cách nhau dấu phẩy)"
            name="genres"
            value={form.genres.join(', ')}
            onChange={handleGenresChange}
          />
          <FormControlLabel control={<Switch checked={form.showing} onChange={handleSwitch} name="showing" />} label="Đang chiếu" />
          <FormControlLabel control={<Switch checked={form.comingSoon} onChange={handleSwitch} name="comingSoon" />} label="Sắp chiếu" />
>>>>>>> b32aa75 (update code)
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button variant="contained" onClick={handleSubmit}>{editingMovie ? 'Cập nhật' : 'Thêm mới'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageMovies;
