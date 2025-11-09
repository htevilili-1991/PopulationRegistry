import axios from 'axios';
import { Citizen, CitizenCreate, CitizenUpdate, UserCreate, User, TokenResponse } from './types';

const API_URL = 'http://localhost:8000/api'; // Changed for Django backend

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (username: string, password: string): Promise<TokenResponse> => {
    const response = await axios.post(`${API_URL}/token/`, { // Changed endpoint for simplejwt
        username: username,
        password: password,
    });
    return response.data; // Expects { access: string, refresh: string }
};

export const registerUser = async (user: UserCreate): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/`, user); // Changed endpoint for DRF UserViewSet
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
    const response = await axios.get(`${API_URL}/citizens/${id}/`, { headers: getAuthHeader() }); // Added trailing slash
    return response.data;
};

export const updateCitizen = async (id: number, citizen: CitizenUpdate): Promise<Citizen> => {
    const response = await axios.put(`${API_URL}/citizens/${id}/`, citizen, { headers: getAuthHeader() }); // Added trailing slash
    return response.data;
};

export const deleteCitizen = async (id: number): Promise<Citizen> => {
    const response = await axios.delete(`${API_URL}/citizens/${id}/`, { headers: getAuthHeader() }); // Added trailing slash
    return response.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/me/`, { headers: getAuthHeader() }); // Assuming a /users/me/ endpoint
    return response.data;
};
