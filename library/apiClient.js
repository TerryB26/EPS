import axios from 'axios';
import { queryKeys } from './queries';

const apiRoutes = {
  [queryKeys.GET_USERS]: '/api/Users',
  [queryKeys.GET_USER_BY_ID]: (id) => `/api/users/${id}`,
};

export const fetchData = async (key, params) => {
  const route = apiRoutes[key];
  if (!route) {
    throw new Error(`API route for key "${key}" not found`);
  }

  const url = typeof route === 'function' ? route(...params) : route;
  const response = await axios.get(url);
  return response.data;
};