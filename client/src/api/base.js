import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// https://stackoverflow.com/questions/45578844/how-to-set-header-and-options-in-axios
authApi.defaults.headers.common['Content-Type'] = 'application/json';
