import api from "./api";

const API_ENDPOINT = "/auth";

export const loginService = (data) => {
  return api.post(`${API_ENDPOINT}/login`, {
    username: data.email.trim(),
    password: data.password,
  });
};

export const registerService = (data) => {
  return api.post(`${API_ENDPOINT}/signup`, {
    email: data.email,
    password: data.password,
    username: data.username,
  });
};

export const getUserProfile = (token) => {
  return api.get(`user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
