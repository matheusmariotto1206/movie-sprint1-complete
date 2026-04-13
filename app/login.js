import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      let userData;
      if (isRegister) {
        userData = await authService.register(name, email, password, parseInt(age) || 18);
      } else {
        userData = await authService.login(email, password);
      }
      await login(userData);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🎬 CineFinder</Text>
      <Text style={styles.subtitle}>{isRegister ? 'Criar Conta' : 'Entrar'}</Text>

      {isRegister && (
        <>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666"
            value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Idade" placeholderTextColor="#666"
            value={age} onChangeText={setAge} keyboardType="numeric" />
        </>
      )}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666"
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#666"
        value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <Text style={styles.buttonText}>{isRegister ? 'Cadastrar' : 'Entrar'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.toggleText}>
          {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', padding: 30 },
  logo: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#fff', fontSize: 22, textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
  input: { backgroundColor: '#16213e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#E50914', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  toggleText: { color: '#E50914', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
