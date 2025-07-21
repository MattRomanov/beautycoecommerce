import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user.isLoggedIn) {
    toast.error('Necesitas iniciar sesión para acceder a esta página.', { toastId: 'auth-required' });
    return <Navigate to="/login" replace />;
  }

  const userRoles = Array.isArray(user.role) ? user.role : [user.isAdmin ? 'admin' : 'cliente'];

  if (allowedRoles && !allowedRoles.some(role => userRoles.includes(role))) {
    toast.error('No tienes permiso para acceder a esta página.', { toastId: 'permission-denied' });
    return <Navigate to="/" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
