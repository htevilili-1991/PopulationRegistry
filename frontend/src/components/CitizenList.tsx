import React, { useEffect, useState } from 'react';
import { getCitizens } from '../api';
import { Citizen } from '../types';

const CitizenList: React.FC = () => {
    const [citizens, setCitizens] = useState<Citizen[]>([]);

    useEffect(() => {
        const fetchCitizens = async () => {
            const data = await getCitizens();
            setCitizens(data);
        };
        fetchCitizens();
    }, []);

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CitizenList;
