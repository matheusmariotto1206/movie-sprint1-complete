import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLogin, useRegister } from '../hooks/useAuthActions';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const loading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (isRegister && password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (isRegister) {
      registerMutation.mutate(
        { name, email, password, age: parseInt(age, 10) || 18 },
        { onError: (error) => Alert.alert('Erro', error.message || 'Falha no cadastro') }
      );
    } else {
      loginMutation.mutate(
        { email, password },
        { onError: (error) => Alert.alert('Erro', error.message || 'Falha na autenticação') }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🎬 CineFinder</Text>
      <Text style={styles.subtitle}>{isRegister ? 'Criar Conta' : 'Entrar'}</Text>

      {isRegister && (
        <>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Idade" placeholderTextColor={colors.textMuted} value={age} onChangeText={setAge} keyboardType="numeric" />
        </>
      )}
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegister ? 'Cadastrar' : 'Entrar'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)} disabled={loading}>
        <Text style={styles.toggleText}>{isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background, justifyContent: 'center', padding: 30 },
    logo: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
    subtitle: { color: c.text, fontSize: 22, textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
    input: { backgroundColor: c.inputBg, color: c.text, padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: c.border },
    button: { backgroundColor: c.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    toggleText: { color: c.primary, textAlign: 'center', marginTop: 20, fontSize: 14 },
  });
