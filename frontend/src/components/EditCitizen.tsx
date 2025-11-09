import React, { useState, useEffect } from 'react';
import { getCitizenById, updateCitizen } from '../api';
import { CitizenUpdate } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

const EditCitizen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [citizen, setCitizen] = useState<CitizenUpdate>({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        place_of_birth: '',
    });

    useEffect(() => {
        const fetchCitizen = async () => {
            if (id) {
                const data = await getCitizenById(parseInt(id));
                setCitizen({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    date_of_birth: data.date_of_birth, // Assuming date_of_birth is already in 'YYYY-MM-DD' format
                    gender: data.gender,
                    place_of_birth: data.place_of_birth,
                });
            }
        };
        fetchCitizen();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCitizen({ ...citizen, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            await updateCitizen(parseInt(id), citizen);
            navigate('/citizens');
        }
    };

    return (
        <div>
            <h2>Edit Citizen</h2>
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
                <button type="submit" className="btn btn-primary">Update Citizen</button>
            </form>
        </div>
    );
};

export default EditCitizen;
