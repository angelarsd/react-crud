import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Data {
  id: number;
  name: string;
  lastname: string;
  age: number | null;
  gender: string;
  email: string;
}
export interface DataPagination {
  result: Data[];
  pagination?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface FiltersData extends Omit<Data, 'id'> {
  page: number;
  perPage: number;
}

export const getData = async (params: Omit<Data, 'id'> | undefined) => {
  const response = await axios.get(`${API_URL}/data`, { params });
  return response?.data || [];
};

export const getDataById = async (id: number) => {
  const response = await axios.get(`${API_URL}/data/${id}`);
  return response.data;
};

export const createData = async (data: Omit<Data, 'id'>) => {
  const response = await axios.post(`${API_URL}/data`, data);
  return response.data;
};

export const updateData = async (id: number, data: Omit<Data, 'id'>) => {
  const response = await axios.put(`${API_URL}/data/${id}`, data);
  return response.data;
};

export const deleteData = async (id: number) => {
  await axios.delete(`${API_URL}/data/${id}`);
};
