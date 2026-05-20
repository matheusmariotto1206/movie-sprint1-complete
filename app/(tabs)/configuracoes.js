import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const { isDark, colors, setDarkMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Text style={styles.name}>{user?.name || user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.themeRow}>
          <View style={styles.themeInfo}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.primary} />
            <View style={styles.themeTexts}>
              <Text style={styles.sectionTitle}>Aparência</Text>
              <Text style={styles.info}>{isDark ? 'Tema escuro' : 'Tema claro'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
        <Text style={styles.hint}>Alterne entre tema claro e escuro. A preferência é salva automaticamente.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o App</Text>
        <Text style={styles.info}>CineFinder v1.0</Text>
        <Text style={styles.info}>Mobile App Development — FIAP</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background, padding: 20 },
    profile: { alignItems: 'center', marginTop: 20, marginBottom: 28 },
    avatar: { fontSize: 60, marginBottom: 12 },
    name: { color: c.text, fontSize: 22, fontWeight: 'bold' },
    email: { color: c.textMuted, fontSize: 14, marginTop: 4 },
    section: { backgroundColor: c.surface, borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: c.border },
    themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    themeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    themeTexts: { marginLeft: 12, flex: 1 },
    sectionTitle: { color: c.text, fontSize: 16, fontWeight: 'bold' },
    info: { color: c.textSecondary, fontSize: 14, marginTop: 2 },
    hint: { color: c.textMuted, fontSize: 12, marginTop: 12, lineHeight: 18 },
    logoutBtn: { backgroundColor: c.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  });
