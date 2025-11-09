import axios from 'axios';
import { Citizen, CitizenCreate, CitizenUpdate } from './types';

const API_URL = 'http://localhost:8000';

export const getCitizens = async (): Promise<Citizen[]> => {
    const response = await axios.get(`${API_URL}/citizens/`);
    return response.data;
};

export const createCitizen = async (citizen: CitizenCreate): Promise<Citizen> => {
    const response = await axios.post(`${API_URL}/citizens/`, citizen);
    return response.data;
};

export const getCitizenById = async (id: number): Promise<Citizen> => {
    const response = await axios.get(`${API_URL}/citizens/${id}`);
    return response.data;
};

export const updateCitizen = async (id: number, citizen: CitizenUpdate): Promise<Citizen> => {
    const response = await axios.put(`${API_URL}/citizens/${id}`, citizen);
    return response.data;
};

export const deleteCitizen = async (id: number): Promise<Citizen> => {
    const response = await axios.delete(`${API_URL}/citizens/${id}`);
    return response.data;
};
