
import { Slavljenik } from '@/types';
import { API_BASE_URL, handleResponse, fetchOptions } from './config';

export const birthdayBoyApi = {
  getAll: async (): Promise<Slavljenik[]> => {
    const response = await fetch(`${API_BASE_URL}/api/Slavljenik`, fetchOptions);
    return handleResponse<Slavljenik[]>(response);
  },

  getById: async (id: number): Promise<Slavljenik> => {
    const response = await fetch(`${API_BASE_URL}/api/Slavljenik/${id}`, fetchOptions);
    return handleResponse<Slavljenik>(response);
  },

  create: async (birthdayBoy: Slavljenik): Promise<Slavljenik> => {
    const response = await fetch(`${API_BASE_URL}/api/Slavljenik`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(birthdayBoy),
    });
    return handleResponse<Slavljenik>(response);
  },

  update: async (id: number, birthdayBoy: Slavljenik): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Slavljenik/${id}`, {
      ...fetchOptions,
      method: 'PUT',
      body: JSON.stringify(birthdayBoy),
    });
    return handleResponse<void>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Slavljenik/${id}`, {
      ...fetchOptions,
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
