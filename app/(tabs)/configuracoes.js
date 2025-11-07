import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const GENRES = ['Ação', 'Comédia', 'Drama', 'Sci-Fi', 'Romance', 'Crime', 'Thriller', 'Terror', 'Animação'];

export default function SettingsScreen() {
  const [selected, setSelected] = useState([]);
  const [userName, setUserName] = useState('');
  const [saved, setSaved] = useState(null);
  const [stats, setStats] = useState({ 
    total: 0, 
    movies: 0, 
    series: 0,
    favoriteGenre: null,
    totalMinutes: 0
  });

  useFocusEffect(
    React.useCallback(() => {
      loadPrefs();
      loadStats();
    }, [])
  );

  const loadPrefs = async () => {
    try {
      const json = await AsyncStorage.getItem('preferences');
      if (json) {
        const p = JSON.parse(json);
        setSelected(p.genres || []);
        setUserName(p.userName || '');
        setSaved(p);
      }
    } catch (e) {
      console.log('Erro ao carregar preferências:', e);
    }
  };

  const loadStats = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      if (json) {
        const favs = JSON.parse(json);
        const movies = favs.filter(f => f.type === 'Filme').length;
        const series = favs.filter(f => f.type === 'Série').length;
        
        // Calcular gênero favorito
        const genreCounts = {};
        favs.forEach(f => {
          if (f.genre) {
            genreCounts[f.genre] = (genreCounts[f.genre] || 0) + 1;
          }
        });
        
        const favoriteGenre = Object.keys(genreCounts).length > 0
          ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
          : null;
        
        // Estimar tempo total (assumindo 120min por filme, 45min por episódio de série)
        const totalMinutes = (movies * 120) + (series * 45 * 8); // 8 episódios por série em média
        
        setStats({ 
          total: favs.length, 
          movies, 
          series,
          favoriteGenre,
          totalMinutes
        });
      }
    } catch (e) {
      console.log('Erro ao carregar estatísticas:', e);
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

    if (selected.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um gênero favorito!');
      return;
    }

    const payload = { 
      genres: selected,
      userName: userName.trim(),
    };

    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(payload));
      setSaved(payload);
      Alert.alert('Sucesso! ✅', 'Seu perfil foi salvo com sucesso!');
    } catch (e) {
      console.log('Erro ao salvar preferências:', e);
      Alert.alert('Erro', 'Não foi possível salvar suas preferências.');
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return '0h';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header - Perfil do Usuário */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {userName ? userName.charAt(0).toUpperCase() : '🎬'}
          </Text>
        </View>
        <Text style={styles.profileName}>{userName || 'Cinéfilo'}</Text>
        <Text style={styles.profileSubtitle}>Membro do CineFinder</Text>
      </View>

      {/* Estatísticas do Usuário */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Meu Perfil Cinematográfico</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.movies}</Text>
            <Text style={styles.statLabel}>Filmes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.series}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
        </View>

        <View style={styles.statsExtra}>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>🎭 Gênero favorito:</Text>
            <Text style={styles.statRowValue}>
              {stats.favoriteGenre || 'Adicione favoritos'}
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>⏱️ Tempo de conteúdo:</Text>
            <Text style={styles.statRowValue}>
              {stats.total > 0 ? formatTime(stats.totalMinutes) : '0h'}
            </Text>
          </View>
        </View>
      </View>

      {/* Informações Pessoais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Informações Pessoais</Text>
        <Text style={styles.sectionSubtitle}>Como podemos te chamar?</Text>
        <TextInput 
          value={userName} 
          onChangeText={setUserName} 
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
        />
      </View>

      {/* Gêneros Favoritos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎭 Gêneros Favoritos</Text>
        <Text style={styles.sectionSubtitle}>
          Selecione seus gêneros preferidos para receber recomendações personalizadas
        </Text>
        
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

        {selected.length > 0 && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoText}>
              ✓ {selected.length} {selected.length === 1 ? 'gênero selecionado' : 'gêneros selecionados'}
            </Text>
          </View>
        )}
      </View>

      {/* Playlists Rápidas - Preparado para próxima etapa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎬 Minhas Playlists</Text>
        <Text style={styles.sectionSubtitle}>
          Organize seus filmes em coleções personalizadas
        </Text>
        
        <View style={styles.playlistPreview}>
          <View style={styles.playlistEmpty}>
            <Text style={styles.playlistEmptyIcon}>📝</Text>
            <Text style={styles.playlistEmptyText}>Em breve!</Text>
            <Text style={styles.playlistEmptySubtext}>
              Sistema de playlists será liberado em breve
            </Text>
          </View>
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity onPress={save} style={styles.saveButton} activeOpacity={0.8}>
        <Text style={styles.saveButtonText}>💾 Salvar Meu Perfil</Text>
      </TouchableOpacity>

      {/* Preview das Preferências Salvas */}
      {saved && (
        <View style={styles.savedContainer}>
          <View style={styles.savedHeader}>
            <Text style={styles.savedTitle}>✅ Perfil Salvo</Text>
          </View>
          <View style={styles.savedContent}>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>👤 Nome:</Text>
              <Text style={styles.savedValue}>{saved.userName}</Text>
            </View>
            <View style={styles.savedItem}>
              <Text style={styles.savedLabel}>🎭 Gêneros:</Text>
              <Text style={styles.savedValue}>
                {saved.genres.length > 0 ? saved.genres.join(', ') : 'Nenhum'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Espaçamento final */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#1976D2',
  },
  avatarLargeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  statsExtra: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statRowLabel: {
    fontSize: 14,
    color: '#666',
  },
  statRowValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  genreChip: {
    padding: 12,
    paddingHorizontal: 16,
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
    fontWeight: '500',
  },
  genreTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedInfo: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedInfoText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  playlistPreview: {
    marginTop: 8,
  },
  playlistEmpty: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  playlistEmptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  playlistEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  playlistEmptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  savedHeader: {
    backgroundColor: '#27ae60',
    padding: 12,
  },
  savedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  savedContent: {
    padding: 16,
  },
  savedItem: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  savedLabel: {
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    minWidth: 90,
  },
  savedValue: {
    color: '#555',
    flex: 1,
  },
});