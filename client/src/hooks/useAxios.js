import axios from 'axios';

export const baseURL = 'http://localhost:3000'

export const axiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
