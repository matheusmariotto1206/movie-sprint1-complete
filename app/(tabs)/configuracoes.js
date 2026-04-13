import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o App</Text>
        <Text style={styles.info}>MovieApp v1.0</Text>
        <Text style={styles.info}>Sprint 3 - Mobile App Development</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20 },
  profile: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  avatar: { fontSize: 60, marginBottom: 12 },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  email: { color: '#888', fontSize: 14, marginTop: 4 },
  section: { backgroundColor: '#16213e', borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  info: { color: '#aaa', fontSize: 14, marginBottom: 4 },
  logoutBtn: { backgroundColor: '#E50914', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
