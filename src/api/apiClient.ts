import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // O process.env.REACT_APP_API_URL
  headers: {
    'Content-Type': 'application/json',
    // IMPORTANTE: La nota dice que el backend espera una "Vertical" en los headers
    'X-Vertical': 'ecommerce' // Ajusta el valor según corresponda (ej. 'ecommerce')
  }
});

export default apiClient;
