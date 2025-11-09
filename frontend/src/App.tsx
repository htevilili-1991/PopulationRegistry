import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CitizenList from './components/CitizenList';
import AddCitizen from './components/AddCitizen';

function App() {
  return (
    <div className="App d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', height: '100vh' }}>
        <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4">Population Registry</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/citizens" className="nav-link text-white" aria-current="page">
              View Citizens
            </Link>
          </li>
          <li>
            <Link to="/add-citizen" className="nav-link text-white">
              Add Citizen
            </Link>
          </li>
        </ul>
        <hr />
      </div>

      {/* Main Content */}
      <div className="container-fluid p-4">
        <Routes>
          <Route path="/" element={<CitizenList />} />
          <Route path="/citizens" element={<CitizenList />} />
          <Route path="/add-citizen" element={<AddCitizen />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
