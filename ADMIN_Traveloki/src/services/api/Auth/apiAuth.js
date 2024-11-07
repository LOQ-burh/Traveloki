import axios from '../../axiosCustomize.js';

const loginAPI = async (username, password) => {
  const URL_API = '/api/v2/auth/login';
  const data = { username, password };
  return axios.post(URL_API, data);
};

const createAdminAPI = async (name, username, email, password, role) => {
  const URL_API = '/api/v1/admin/register';
  const data = { name, username, email, password, role };
  return axios.post(URL_API, data);
};

export { loginAPI, createAdminAPI };
