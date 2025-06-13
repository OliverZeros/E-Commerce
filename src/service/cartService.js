import api from "./api";

const API_ENDPOINT = "/cart";

export const addToCartService = (productId, token) => {
  return api.post(
    `${API_ENDPOINT}/add`,
    { productid: productId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getCartItems = (token) => {
  return api.get(`${API_ENDPOINT}/get`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteCartItem = (Id, token) => {
  return api.delete(`${API_ENDPOINT}/remove/`, {
    headers: {
      Authorization: token,
    },
    data: {
      productid: Id,
    },
  });
};
