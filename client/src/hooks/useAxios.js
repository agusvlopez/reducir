import axios from 'axios';

export const baseURL = 'http://localhost:3000'

// Create an Axios instance with the base URL and default headers
export const axiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
