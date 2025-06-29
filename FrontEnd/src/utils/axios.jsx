import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mentorx-backend.onrender.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
