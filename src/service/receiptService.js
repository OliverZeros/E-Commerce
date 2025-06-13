import api from "./api";

const API_ENDPOINT = "/receipt";

export const createReceipt = (data, token) => {
  return api.post(
    `${API_ENDPOINT}/create`,
    {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getReceipts = (token) => {
  return api.get(`${API_ENDPOINT}/get`, {
    headers: {
      Authorization: token,
    },
  });
};

export const payReceipt = (receiptId, token) => {
  return api.post(
    `${API_ENDPOINT}/pay`,
    {
      receiptid: receiptId,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getAllReceipts = (token) => {
  return api.get(`${API_ENDPOINT}/all`, {
    headers: {
      Authorization: token,
    },
  });
};
