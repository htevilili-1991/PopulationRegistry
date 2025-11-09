import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        onLogout(); // Force logout if user data cannot be fetched
      }
    };
    fetchUser();
  }, [onLogout]);

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">Population Registry</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/citizens">Manage Citizens</Link>
              </li>
              {/* Add more navigation links here */}
            </ul>
            <span className="navbar-text text-white me-3">
              Welcome, {user.name}!
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h2 className="mb-4">Dashboard Overview</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h5 className="card-title">Total Citizens</h5>
                <p className="card-text display-4">1,234</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Registered Users</h5>
                <p className="card-text display-4">56</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Roles Defined</h5>
                <p className="card-text display-4">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Recent Activity</div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">User 'admin' added a new citizen.</li>
                  <li className="list-group-item">User 'editor' updated a citizen's record.</li>
                  <li className="list-group-item">User 'admin' created a new role.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;