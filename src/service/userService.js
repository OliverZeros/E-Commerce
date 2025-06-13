import api from "./api";

const API_ENDPOINT = "/user";

export const getUserProfile = (token) => {
  return api.get(`${API_ENDPOINT}/profile`, {
    headers: {
      Authorization: token,
    },
  });
};

export const userSurvey = (data, token) => {
  return api.post(
    `${API_ENDPOINT}/survey`,
    {
      category: data.category,
      color: data.color,
      size: data.size,
      model: data.model,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getAllUsers = (token) => {
  return api.get(`${API_ENDPOINT}/all`, {
    headers: {
      Authorization: token,
    },
  });
};
