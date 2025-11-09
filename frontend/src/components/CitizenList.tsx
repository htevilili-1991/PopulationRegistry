import React, { useEffect, useState } from 'react';
import { getCitizens, deleteCitizen } from '../api';
import { Citizen } from '../types';
import { Link } from 'react-router-dom';

const CitizenList: React.FC = () => {
    const [citizens, setCitizens] = useState<Citizen[]>([]);

    const fetchCitizens = async () => {
        const data = await getCitizens();
        setCitizens(data);
    };

    useEffect(() => {
        fetchCitizens();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this citizen?')) {
            await deleteCitizen(id);
            fetchCitizens(); // Refresh the list after deletion
        }
    };

    return (
        <div>
            <h2>Citizen List</h2>
            <table className="table table-striped">
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
                    {citizens.map((citizen) => (
                        <tr key={citizen.id}>
                            <td>{citizen.national_id}</td>
                            <td>{citizen.first_name}</td>
                            <td>{citizen.last_name}</td>
                            <td>{citizen.date_of_birth}</td>
                            <td>{citizen.gender}</td>
                            <td>{citizen.place_of_birth}</td>
                            <td>
                                <Link to={`/edit-citizen/${citizen.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                                <button onClick={() => handleDelete(citizen.id)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CitizenList;
