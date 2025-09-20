import React from 'react';
<<<<<<< HEAD
import { Route } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import AdminLayout from '../AdminLayout';
import Dashboard from '../pages/Dashboard';
import ManageMovies from '../pages/ManageMovies';

const adminRoutes = (
  <Route
    path="/admin"
    element={
      <PrivateRoute requireAdmin={true}>
        <AdminLayout />
      </PrivateRoute>
    }
  >
    <Route path="manage-movies" element={<ManageMovies />} />
    <Route index element={<Dashboard />} />
    {/* Thêm các route khác nếu cần */}
  </Route>
);

export default adminRoutes;
=======
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../routes/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import ManageMovies from '../pages/ManageMovies';
import Schedules from '../pages/Schedules';
import Rooms from '../pages/Rooms';
import Users from '../pages/Users';
import Contacts from '../pages/Contact';
import Promotions from '../pages/Promotions';
import Settings from '../pages/Settings';

const AdminRoutes = () => (
  <Routes>
    <Route
      path="dashboard"
      element={
        <PrivateRoute requireAdmin={true}>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="manage-movies"
      element={
        <PrivateRoute requireAdmin={true}>
          <ManageMovies />
        </PrivateRoute>
      }
    />
    <Route
      path="schedules"
      element={
        <PrivateRoute requireAdmin={true}>
          <Schedules />
        </PrivateRoute>
      }
    />
    <Route
      path="rooms"
      element={
        <PrivateRoute requireAdmin={true}>
          <Rooms />
        </PrivateRoute>
      }
    />
    <Route
      path="users"
      element={
        <PrivateRoute requireAdmin={true}>
          <Users />
        </PrivateRoute>
      }
    />
    <Route
      path="contacts"
      element={
        <PrivateRoute requireAdmin={true}>
          <Contacts />
        </PrivateRoute>
      }
    />
    <Route
      path="promotions"
      element={
        <PrivateRoute requireAdmin={true}>
          <Promotions />
        </PrivateRoute>
      }
    />
    <Route
      path="settings"
      element={
        <PrivateRoute requireAdmin={true}>
          <Settings />
        </PrivateRoute>
      }
    />
    <Route
      index
      element={
        <PrivateRoute requireAdmin={true}>
          <Dashboard />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AdminRoutes;
>>>>>>> b32aa75 (update code)
