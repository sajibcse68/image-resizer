import axios from 'axios';

const getBaseUrl = () => {
  return 'http://localhost:3001/api/';
};

const $axios = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default $axios;
