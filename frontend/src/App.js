import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CitizenList from './components/CitizenList'; // Placeholder
import AddCitizen from './components/AddCitizen';   // Placeholder
import EditCitizen from './components/EditCitizen'; // Placeholder
import api from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await api.get('/user'); // Verify token
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/citizens"
            element={isAuthenticated ? <CitizenList /> : <Navigate to="/login" />}
          />
          <Route
            path="/citizens/add"
            element={isAuthenticated ? <AddCitizen /> : <Navigate to="/login" />}
          />
          <Route
            path="/citizens/edit/:id"
            element={isAuthenticated ? <EditCitizen /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;