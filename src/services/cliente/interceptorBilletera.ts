import axios from "axios";

const apiClient4 = axios.create({
  baseURL: 'http://localhost:5286/api',
  headers: {
      'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient4;