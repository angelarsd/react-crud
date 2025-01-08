import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Data {
  id: number;
  name: string;
  lastname: string;
  age: number;
  gender: string;
  email: string;
}

export const getData = async () => {
  const response = await axios.get(API_URL);
  return response?.data?.result || [];
};

export const createData = async (data: { name: string; email: string }) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateData = async (
  id: string,
  data: { name: string; email: string }
) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteData = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
