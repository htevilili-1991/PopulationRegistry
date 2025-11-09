import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CitizenList from './components/CitizenList';
import AddCitizen from './components/AddCitizen';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Population Registry</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/citizens">View Citizens</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-citizen">Add Citizen</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-3">
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
