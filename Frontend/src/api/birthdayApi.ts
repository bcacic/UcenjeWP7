
import { Rodjendan } from '@/types';
import { API_BASE_URL, handleResponse, fetchOptions } from './config';

export const birthdayApi = {
  getAll: async (): Promise<Rodjendan[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Rodjendan`, fetchOptions);
    return handleResponse<Rodjendan[]>(response);
  },

  getById: async (id: number): Promise<Rodjendan> => {
    const response = await fetch(`${API_BASE_URL}/api/Rodjendan/${id}`, fetchOptions);
    return handleResponse<Rodjendan>(response);
  },

  create: async (birthday: Rodjendan): Promise<Rodjendan> => {
    const response = await fetch(`${API_BASE_URL}/api/Rodjendan`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(birthday),
    });
    return handleResponse<Rodjendan>(response);
  },

  update: async (id: number, birthday: Rodjendan): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Rodjendan/${id}`, {
      ...fetchOptions,
      method: 'PUT',
      body: JSON.stringify(birthday),
    });
    return handleResponse<void>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Rodjendan/${id}`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
