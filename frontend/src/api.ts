import axios from 'axios';
import { Citizen, CitizenCreate } from './types';

const API_URL = 'http://localhost:8000';

export const getCitizens = async (): Promise<Citizen[]> => {
    const response = await axios.get(`${API_URL}/citizens/`);
    return response.data;
};

export const createCitizen = async (citizen: CitizenCreate): Promise<Citizen> => {
    const response = await axios.post(`${API_URL}/citizens/`, citizen);
    return response.data;
};
