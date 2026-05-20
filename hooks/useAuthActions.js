import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (userData) => login(userData),
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ name, email, password, age }) =>
      authService.register(name, email, password, age),
    onSuccess: (userData) => login(userData),
  });
};
