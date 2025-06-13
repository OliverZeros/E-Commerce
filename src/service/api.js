import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "1",
  },
});

export default api;
