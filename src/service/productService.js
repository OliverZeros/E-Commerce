import api from "./api";

const API_ENDPOINT = "/product";

export const getAllProducts = () => {
  return api.get(`${API_ENDPOINT}/getAll`, {});
};

export const addProduct = (formData, token) => {
  return api.post(`${API_ENDPOINT}/add`, formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateProduct = (formData, token) => {
  return api.patch(`${API_ENDPOINT}/update`, formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteProduct = (id, token) => {
  return api.delete(`${API_ENDPOINT}/delete/`, {
    headers: {
      Authorization: token,
    },
    data: {
      productId: id,
    },
  });
};
