import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050', // ✅ change to Vercel/Render URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
