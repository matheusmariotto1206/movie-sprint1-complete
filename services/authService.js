const BASE_URL = 'http://10.0.2.2:8080';

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Erro ${response.status}: ${text}`);
    const data = JSON.parse(text);
    console.log('LOGIN RESPONSE:', JSON.stringify(data));
    return { token: data.token, id: data.id, name: data.name, email: data.email };
  },
  register: async (name, email, password, age) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, age: age || 18 }),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Erro ${response.status}: ${text}`);
    const data = JSON.parse(text);
    return { token: data.token, id: data.id, name: data.name, email: data.email };
  },
};
