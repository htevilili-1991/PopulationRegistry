import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';

function EditCitizen() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    national_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    place_of_birth: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitizen = async () => {
      try {
        const response = await api.get(`/citizens/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch citizen data.');
        console.error('Fetch citizen error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitizen();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/citizens/${id}`, formData);
      navigate('/citizens');
    } catch (err) {
      setError('Failed to update citizen. Please check your input.');
      console.error('Update citizen error:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading citizen data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Edit Citizen</h2>
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
            <button type="submit" className="btn btn-primary">Update Citizen</button>
            <Link to="/citizens" className="btn btn-secondary ms-2">Back to Citizen List</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCitizen;