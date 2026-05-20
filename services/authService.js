import { api } from './api';

const BASE_URL = 'http://10.0.2.2:8080';

const parseToken = (text) => {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Resposta vazia do servidor');

  try {
    const data = JSON.parse(trimmed);
    if (typeof data === 'string') return data;
    if (data?.token) return data.token;
  } catch {
    // JWT puro (legado do register)
    if (trimmed.startsWith('eyJ')) return trimmed;
  }

  throw new Error('Não foi possível obter o token de autenticação');
};

const parseErrorMessage = (text, status) => {
  try {
    const data = JSON.parse(text);
    return data.message || data.error || data.detail || text;
  } catch {
    if (text?.length > 120) return `Erro ${status}`;
    return text || `Erro ${status}`;
  }
};

const fetchProfile = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(parseErrorMessage(text, response.status));
  return JSON.parse(text);
};

const authenticate = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(parseErrorMessage(text, response.status));

  const token = parseToken(text);
  const profile = await fetchProfile(token);

  return {
    token,
    id: profile.id,
    name: profile.name,
    email: profile.email,
  };
};

const withTimeout = (promise, ms = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Servidor não respondeu a tempo')), ms)
    ),
  ]);

export const authService = {
  getMe: (token) => fetchProfile(token),

  validateSession: async () => {
    await withTimeout(api.get('/lists?page=0&size=1'), 5000);
  },

  login: async (email, password) => {
    return authenticate(`${BASE_URL}/auth/login`, { email, password });
  },

  register: async (name, email, password, age) => {
    return authenticate(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
      age: age || 18,
    });
  },
};
