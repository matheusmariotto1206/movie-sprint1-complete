import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8080/api';

const getToken = async () => {
  try {
    const userStr = await AsyncStorage.getItem('@user');
    console.log('STORED USER:', userStr);
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('TOKEN FOUND:', user.token ? 'sim' : 'não');
      return user.token || null;
    }
  } catch (e) {
    console.error('Erro ao obter token:', e);
  }
  return null;
};

const getHeaders = async () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('HEADERS:', JSON.stringify(headers));
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!response.ok) throw new Error(`Erro ${response.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const api = {
  get: async (endpoint) => {
    const headers = await getHeaders();
    const url = `${BASE_URL}${endpoint}`;
    console.log('FETCH URL:', url);
    try {
      const response = await fetch(url, { headers });
      console.log('STATUS:', response.status);
      const text = await response.text();
      console.log('BODY:', text.substring(0, 200));
      if (!response.ok) throw new Error(`Erro ${response.status}: ${text}`);
      try { return JSON.parse(text); } catch { return text; }
    } catch (err) {
      console.log('FETCH ERROR:', err.message);
      throw err;
    }
  },
  post: async (endpoint, data) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(response);
  },
  put: async (endpoint, data) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  patch: async (endpoint, data) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (endpoint) => {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(response);
  },
};