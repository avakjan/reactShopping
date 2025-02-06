// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

axios.defaults.withCredentials = true;

export const getItems = (categoryId = 0) => {
  return axios.get(`${API_BASE_URL}/items`, {
    params: { categoryId }
  });
};

export const getItemDetails = (id) => {
  return axios.get(`${API_BASE_URL}/items/${id}`);
};

export const addToCart = (itemId, sizeId, quantity) => {
  return axios.post(`${API_BASE_URL}/items/addToCart`, {
    itemId,
    sizeId,
    quantity
  });
};

export const getCart = () => axios.get(`${API_BASE_URL}/Cart/Index`);

export const removeFromCart = (itemId, sizeId) =>
  axios.post(`${API_BASE_URL}/Cart/Remove`, { itemId, sizeId });

export const updateCartQuantities = (cartViewModel) =>
  axios.post(`${API_BASE_URL}/Cart/UpdateQuantities`, cartViewModel);

// Optionally, if you want to get checkout details:
export const getCheckout = () => axios.get(`${API_BASE_URL}/Cart/Checkout`);

// And to post checkout details:
export const postCheckout = (checkoutData) =>
  axios.post(`${API_BASE_URL}/Cart/Checkout`, checkoutData);