import axios from 'axios';
import { Citizen, CitizenCreate, CitizenUpdate, UserCreate, User } from './types';

const API_URL = 'http://localhost:8000';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (username: string, password: string): Promise<string> => {
    const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
        username: username,
        password: password,
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
};

export const registerUser = async (user: UserCreate): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/register/`, user);
    return response.data;
};

export const getCitizens = async (): Promise<Citizen[]> => {
    const response = await axios.get(`${API_URL}/citizens/`, { headers: getAuthHeader() });
    return response.data;
};

export const createCitizen = async (citizen: CitizenCreate): Promise<Citizen> => {
    const response = await axios.post(`${API_URL}/citizens/`, citizen, { headers: getAuthHeader() });
    return response.data;
};

export const getCitizenById = async (id: number): Promise<Citizen> => {
    const response = await axios.get(`${API_URL}/citizens/${id}`, { headers: getAuthHeader() });
    return response.data;
};

export const updateCitizen = async (id: number, citizen: CitizenUpdate): Promise<Citizen> => {
    const response = await axios.put(`${API_URL}/citizens/${id}`, citizen, { headers: getAuthHeader() });
    return response.data;
};

export const deleteCitizen = async (id: number): Promise<Citizen> => {
    const response = await axios.delete(`${API_URL}/citizens/${id}`, { headers: getAuthHeader() });
    return response.data;
};
