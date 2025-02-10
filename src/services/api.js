// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is applied to all requests using this instance.
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Please log in.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Now export functions that use your custom instance.
export const getItems = (categoryId = 0) => {
  return api.get(`/items`, { params: { categoryId } });
};

export const getItemDetails = (id) => {
  return api.get(`/items/${id}`);
};

export const addToCart = (itemId, sizeId, quantity) => {
  return api.post(`/items/addToCart`, { itemId, sizeId, quantity });
};

export const getCart = () => api.get(`/Cart/Index`);

export const removeFromCart = (itemId, sizeId) =>
  api.post(`/Cart/Remove`, { itemId, sizeId });

export const updateCartQuantities = (cartViewModel) =>
  api.post(`/Cart/UpdateQuantities`, cartViewModel);

export const getCheckout = () => api.get(`/Cart/Checkout`);

export const postCheckout = (checkoutData) =>
  api.post(`/Cart/Checkout`, checkoutData);

export default api;