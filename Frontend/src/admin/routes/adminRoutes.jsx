import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import AdminLayout from '../AdminLayout';
import Dashboard from '../pages/Dashboard';

const adminRoutes = (
  <Route
    path="/admin"
    element={
      <PrivateRoute requireAdmin={true}>
        <AdminLayout />
      </PrivateRoute>
    }
  >
    <Route index element={<Dashboard />} />
    {/* Thêm các route khác nếu cần */}
  </Route>
);

export default adminRoutes;
