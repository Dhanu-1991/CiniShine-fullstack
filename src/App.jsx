import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './auth/privateRoute.jsx';
import { Signup } from './auth/signup.jsx';
import { Signin } from './auth/signin.jsx';
import {Sidebar} from './signedupUsers/Body/Sidebar.jsx';
import ForgotPassword from './auth/forgotpassword.jsx';
import { useAuth } from './auth/authcontext/authcontext.jsx';
import Home from './Default/Body/Home.jsx';
import AuthHeader from './signedupUsers/Header/AuthHeader.jsx';
import PublicHeader from './Default/Header/PublicHeader.jsx';
import Footer from './Default/Footer.jsx';
import PricingDefault from './Default/Body/PricingDefault.jsx';
import { useState } from 'react';
import Logout from './signedupUsers/Body/Logout.jsx';
import Dashboard from './signedupUsers/Body/Dashboard.jsx';
export default function App() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-100">
      <Router>
        {isAuthenticated ? (
          <>
            <AuthHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar sidebarOpen={sidebarOpen} />
          </>
        ) : (
          <PublicHeader />
        )}
        <Routes>
          {isAuthenticated ? (
            <Route element={<PrivateRoute />}>
              <Route
                path="/dashboard"
                element={
                  <Dashboard sidebarOpen={sidebarOpen} />
                } />
              <Route path="/logout" element={<Logout />} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          ) : (
            <>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signin/forgot-password" element={<ForgotPassword />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/pricing" element={<PricingDefault />} />
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        {isAuthenticated ? null : <Footer />}
      </Router>
    </div>
  );
}
