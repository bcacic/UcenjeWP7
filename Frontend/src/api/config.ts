
// API configuration
export const API_BASE_URL = 'https://ucenjewp7.onrender.com';
// export const API_BASE_URL = 'http://localhost:5187';

// Helper function to handle API responses
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error: ${response.status}`);
  }

  // Check if the response is empty or not JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  }

  // For binary or empty responses
  return {} as T;
}

// Common fetch options with CORS settings
export const fetchOptions = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
};
