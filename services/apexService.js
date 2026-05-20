import { Platform } from 'react-native';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const APEX_DIRECT_URL = 'https://oracleapex.com/ords/cinefinder/cinefinder/top-movies';
const TIMEOUT_MS = 15000;

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Tempo esgotado ao conectar. Verifique se o backend está rodando.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const normalizeItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
};

const fetchFromBackendProxy = async () => {
  const response = await fetchWithTimeout(`${API_BASE}/api/apex/top-movies`);
  const text = await response.text();

  if (!response.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.message || `Erro ${response.status} no backend`);
    } catch {
      throw new Error(text || `Erro ${response.status} no backend`);
    }
  }

  const data = JSON.parse(text);
  return normalizeItems(data);
};

const fetchFromApexDirect = async () => {
  const response = await fetchWithTimeout(APEX_DIRECT_URL);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Oracle APEX respondeu com status ${response.status}`);
  }

  return normalizeItems(JSON.parse(text));
};

export const getTopMovies = async () => {
  try {
    return await fetchFromBackendProxy();
  } catch (proxyError) {
    console.warn('Proxy APEX via Spring falhou, tentando URL direta:', proxyError.message);
    try {
      return await fetchFromApexDirect();
    } catch (directError) {
      throw new Error(
        proxyError.message ||
          directError.message ||
          'Não foi possível carregar o Top APEX. Inicie o backend Java e confira a URL no Oracle APEX.'
      );
    }
  }
};
