import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const response = await api.get('/citizens');
        setCitizens(response.data);
      } catch (err) {
        setError('Failed to fetch citizens.');
        console.error('Fetch citizens error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitizens();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this citizen?')) {
      try {
        await api.delete(`/citizens/${id}`);
        setCitizens(citizens.filter(citizen => citizen.id !== id));
      } catch (err) {
        setError('Failed to delete citizen.');
        console.error('Delete citizen error:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading citizens...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Citizen List</h2>
        <Link to="/citizens/add" className="btn btn-primary">Add New Citizen</Link>
      </div>

      {citizens.length === 0 ? (
        <div className="alert alert-info">No citizens found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>National ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Place of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map(citizen => (
                <tr key={citizen.id}>
                  <td>{citizen.national_id}</td>
                  <td>{citizen.first_name}</td>
                  <td>{citizen.last_name}</td>
                  <td>{citizen.date_of_birth}</td>
                  <td>{citizen.gender}</td>
                  <td>{citizen.place_of_birth}</td>
                  <td>
                    <Link to={`/citizens/edit/${citizen.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    <button onClick={() => handleDelete(citizen.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CitizenList;