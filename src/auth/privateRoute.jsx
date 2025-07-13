// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../auth/authcontext/authcontext.jsx';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
