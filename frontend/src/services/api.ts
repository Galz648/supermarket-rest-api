import axios from 'axios';
import { Supermarket, Item, Price, Discount } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Supermarket API calls
export const getSupermarkets = async (): Promise<Supermarket[]> => {
  const response = await api.get('/supermarkets');
  return response.data;
};

export const getSupermarketById = async (id: string): Promise<Supermarket> => {
  const response = await api.get(`/supermarkets/${id}`);
  return response.data;
};

export const getNearbySupermakerts = async (lat: number, lng: number): Promise<Supermarket[]> => {
  const response = await api.get(`/supermarkets/nearby?lat=${lat}&lng=${lng}`);
  return response.data;
};

// Item API calls
export const getItems = async (page = 1, limit = 20): Promise<Item[]> => {
  const response = await api.get(`/items?page=${page}&limit=${limit}`);
  return response.data;
};

export const getItemById = async (id: string): Promise<Item> => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const searchItems = async (query: string): Promise<Item[]> => {
  const response = await api.get(`/items/search?q=${query}`);
  return response.data;
};

// Price API calls
export const getPrice = async (itemId: string, supermarketId: string): Promise<Price> => {
  const response = await api.get(`/prices?itemId=${itemId}&supermarketId=${supermarketId}`);
  return response.data;
};

export const comparePrices = async (itemIds: string[], supermarketIds: string[]): Promise<Price[]> => {
  const response = await api.get(
    `/prices/compare?itemIds=${itemIds.join(',')}&supermarketIds=${supermarketIds.join(',')}`
  );
  return response.data;
};

// Discount API calls
export const getDiscounts = async (supermarketId: string): Promise<Discount[]> => {
  const response = await api.get(`/discounts?supermarketId=${supermarketId}`);
  return response.data;
};

export const getItemDiscounts = async (itemId: string): Promise<Discount[]> => {
  const response = await api.get(`/discounts/item/${itemId}`);
  return response.data;
};

export default api; 
