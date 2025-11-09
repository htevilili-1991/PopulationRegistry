import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function AddCitizen() {
  const [formData, setFormData] = useState({
    national_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    place_of_birth: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/citizens', formData);
      navigate('/citizens');
    } catch (err) {
      setError('Failed to add citizen. Please check your input.');
      console.error('Add citizen error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Add New Citizen</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="national_id" className="form-label">National ID:</label>
              <input type="text" className="form-control" id="national_id" name="national_id" value={formData.national_id} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">First Name:</label>
              <input type="text" className="form-control" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">Last Name:</label>
              <input type="text" className="form-control" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="date_of_birth" className="form-label">Date of Birth:</label>
              <input type="date" className="form-control" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender:</label>
              <input type="text" className="form-control" id="gender" name="gender" value={formData.gender} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="place_of_birth" className="form-label">Place of Birth:</label>
              <input type="text" className="form-control" id="place_of_birth" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Add Citizen</button>
            <Link to="/citizens" className="btn btn-secondary ms-2">Back to Citizen List</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCitizen;