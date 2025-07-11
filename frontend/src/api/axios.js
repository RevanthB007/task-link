import axios from 'axios'
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api/' : '/api',
  timeout: 10000,
  headers: {'X-Custom-Header': 'foobar'}
});