import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GENRES = ['Ação', 'Comédia', 'Drama', 'Sci-Fi', 'Romance', 'Crime', 'Thriller', 'Terror', 'Animação'];

export default function SettingsScreen() {
  const [selected, setSelected] = useState([]);
  const [minRating, setMinRating] = useState('0');
  const [userName, setUserName] = useState('');
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    try {
      const json = await AsyncStorage.getItem('preferences');
      if (json) {
        const p = JSON.parse(json);
        setSelected(p.genres || []);
        setMinRating(String(p.minRating || '0'));
        setUserName(p.userName || '');
        setSaved(p);
      }
    } catch (e) {
      console.log('Erro ao carregar preferências:', e);
    }
  };

  const toggleGenre = (g) => {
    setSelected(prev => 
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const save = async () => {
    if (!userName.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha seu nome!');
      return;
    }

    const rating = Number(minRating || 0);
    if (rating < 0 || rating > 10) {
      Alert.alert('Atenção', 'A nota deve estar entre 0 e 10!');
      return;
    }

    const payload = { 
      genres: selected, 
      minRating: rating,
      userName: userName.trim(),
    };

    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(payload));
      setSaved(payload);
      Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
    } catch (e) {
      console.log('Erro ao salvar preferências:', e);
      Alert.alert('Erro', 'Não foi possível salvar as preferências.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Informações Pessoais</Text>
        <TextInput 
          value={userName} 
          onChangeText={setUserName} 
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎭 Gêneros Favoritos</Text>
        <Text style={styles.subtitle}>Toque para selecionar seus gêneros preferidos</Text>
        
        <View style={styles.genreContainer}>
          {GENRES.map(g => (
            <TouchableOpacity 
              key={g} 
              onPress={() => toggleGenre(g)} 
              style={[
                styles.genreChip,
                selected.includes(g) && styles.genreChipSelected
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.genreText,
                selected.includes(g) && styles.genreTextSelected
              ]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Nota Mínima</Text>
        <Text style={styles.subtitle}>Defina a nota mínima para filmes (0-10)</Text>
        <TextInput 
          value={minRating} 
          onChangeText={setMinRating} 
          keyboardType="numeric" 
          style={styles.input}
          placeholder="Digite a nota (0-10)"
          placeholderTextColor="#999"
          maxLength={2}
        />
      </View>

      <TouchableOpacity onPress={save} style={styles.saveButton} activeOpacity={0.8}>
        <Text style={styles.saveButtonText}>💾 Salvar Preferências</Text>
      </TouchableOpacity>

      {saved && (
        <View style={styles.savedContainer}>
          <Text style={styles.savedTitle}>✅ Última configuração salva:</Text>
          <View style={styles.savedItem}>
            <Text style={styles.savedLabel}>Nome:</Text>
            <Text style={styles.savedValue}>{saved.userName}</Text>
          </View>
          <View style={styles.savedItem}>
            <Text style={styles.savedLabel}>Gêneros:</Text>
            <Text style={styles.savedValue}>
              {saved.genres.length > 0 ? saved.genres.join(', ') : 'Nenhum selecionado'}
            </Text>
          </View>
          <View style={styles.savedItem}>
            <Text style={styles.savedLabel}>Nota mínima:</Text>
            <Text style={styles.savedValue}>{saved.minRating}/10</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreChip: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    margin: 4,
    backgroundColor: '#fff',
  },
  genreChipSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  genreText: {
    color: '#333',
    fontSize: 14,
  },
  genreTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    margin: 16,
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  savedTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: '#27ae60',
  },
  savedItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  savedLabel: {
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  savedValue: {
    color: '#555',
    flex: 1,
  },
});