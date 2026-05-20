import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { clearFavoriteListCache } from '../services/favoriteService';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('@user');
        if (!stored) return;

        const parsed = JSON.parse(stored);
        if (!parsed?.token) {
          await AsyncStorage.removeItem('@user');
          return;
        }

        // Restaura login salvo no celular imediatamente (não pede cadastro de novo)
        if (isMounted) setUser(parsed);

        try {
          const profile = await authService.getMe(parsed.token);
          const updated = { ...parsed, ...profile, token: parsed.token };
          if (isMounted) {
            setUser(updated);
            await AsyncStorage.setItem('@user', JSON.stringify(updated));
          }
        } catch (err) {
          const message = String(err?.message || '');
          const sessionInvalid =
            message.includes('401') || message.toLowerCase().includes('unauthorized');

          if (sessionInvalid) {
            // Token expirou ou usuário não existe mais no servidor (ex.: backend reiniciado)
            await AsyncStorage.removeItem('@user');
            if (isMounted) setUser(null);
          }
          // Backend desligado: mantém login local para o app abrir
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));
  };

  const logout = async () => {
    clearFavoriteListCache();
    setUser(null);
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
