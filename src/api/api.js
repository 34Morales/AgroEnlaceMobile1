import axios from 'axios';

export const API_URL = 'https://agroenlace.alwaysdata.net/api';

export const WEB_URL = 'https://agroenlace.alwaysdata.net';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});