const TOKEN_KEY = 'jwtToken';
const USER_KEY = 'currentUser';

export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const storeUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearSession = () => {
  clearToken();
  clearUser();
};