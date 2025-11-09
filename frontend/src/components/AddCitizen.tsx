import React, { useState } from 'react';
import { createCitizen } from '../api';
import { CitizenCreate } from '../types';
import { useNavigate } from 'react-router-dom';

const AddCitizen: React.FC = () => {
    const navigate = useNavigate();
    const [citizen, setCitizen] = useState<CitizenCreate>({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        place_of_birth: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCitizen({ ...citizen, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createCitizen(citizen);
        navigate('/citizens');
    };

    return (
        <div>
            <h2>Add New Citizen</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="first_name" name="first_name" value={citizen.first_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="last_name" name="last_name" value={citizen.last_name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" id="date_of_birth" name="date_of_birth" value={citizen.date_of_birth} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select className="form-select" id="gender" name="gender" value={citizen.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="place_of_birth" className="form-label">Place of Birth</label>
                    <input type="text" className="form-control" id="place_of_birth" name="place_of_birth" value={citizen.place_of_birth} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Citizen</button>
            </form>
        </div>
    );
};

export default AddCitizen;
