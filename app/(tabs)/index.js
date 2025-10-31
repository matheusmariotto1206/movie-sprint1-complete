import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert, StyleSheet, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MovieCard from '../../components/MovieCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_DATA = [
  { 
    id: 'm1', 
    title: 'Stranger Things', 
    type: 'Série', 
    genre: 'Sci-Fi', 
    description: 'Adolescentes enfrentam mistérios sobrenaturais em uma pequena cidade americana nos anos 80.' 
  },
  { 
    id: 'm2', 
    title: 'Oppenheimer', 
    type: 'Filme', 
    genre: 'Drama', 
    description: 'A vida e dilemas do físico J. Robert Oppenheimer durante o desenvolvimento da bomba atômica.' 
  },
  { 
    id: 'm3', 
    title: 'Matrix', 
    type: 'Filme', 
    genre: 'Sci-Fi', 
    description: 'Um hacker descobre a verdade sobre a realidade e seu papel na guerra contra seus controladores.' 
  },
  { 
    id: 'm4', 
    title: 'The Crown', 
    type: 'Série', 
    genre: 'Drama', 
    description: 'Drama histórico sobre o reinado da Rainha Elizabeth II e a família real britânica.' 
  },
  { 
    id: 'm5', 
    title: 'The Office', 
    type: 'Série', 
    genre: 'Comédia', 
    description: 'Mockumentary sobre o cotidiano hilário de funcionários de um escritório.' 
  },
  { 
    id: 'm6', 
    title: 'Parasita', 
    type: 'Filme', 
    genre: 'Thriller', 
    description: 'Tensão social e reviravoltas inesperadas quando uma família pobre se infiltra na casa de ricos.' 
  },
  { 
    id: 'm7', 
    title: 'Breaking Bad', 
    type: 'Série', 
    genre: 'Crime', 
    description: 'Professor de química com câncer transforma-se em fabricante de metanfetamina.' 
  },
  { 
    id: 'm8', 
    title: 'Amélie Poulain', 
    type: 'Filme', 
    genre: 'Romance', 
    description: 'Uma jovem sonhadora e criativa decide mudar a vida das pessoas ao seu redor.' 
  },
  { 
    id: 'm9', 
    title: 'Dark', 
    type: 'Série', 
    genre: 'Sci-Fi', 
    description: 'Mistérios e viagens no tempo conectam quatro famílias em uma pequena cidade alemã.' 
  },
  { 
    id: 'm10', 
    title: 'Inception', 
    type: 'Filme', 
    genre: 'Ação', 
    description: 'Ladrão especializado em extrair segredos do subconsciente através dos sonhos.' 
  },
];

export default function SuggestionsScreen() {
  const router = useRouter();
  const [movies] = useState(MOCK_DATA);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [filteredMovies, setFilteredMovies] = useState(MOCK_DATA);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedType]);

  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      setFavorites(json ? JSON.parse(json) : []);
    } catch (e) {
      console.log('Erro ao carregar favoritos:', e);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm.trim()) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'Todos') {
      filtered = filtered.filter(movie => movie.type === selectedType);
    }

    setFilteredMovies(filtered);
  };

  const addFavorite = async (item) => {
    try {
      if (favorites.find(f => f.id === item.id)) {
        Alert.alert('Aviso', 'Esse item já está nos favoritos!');
        return;
      }
      const newFavs = [...favorites, item];
      setFavorites(newFavs);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
      Alert.alert('Sucesso', 'Adicionado aos favoritos!');
    } catch (e) {
      console.log('Erro ao adicionar favorito:', e);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedType('Todos');
  };

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <Text style={styles.resultCount}>
        {filteredMovies.length} de {movies.length} títulos disponíveis
      </Text>
      
      <View style={styles.searchInputWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, gênero..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {['Todos', 'Filme', 'Série'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            style={[
              styles.filterChip,
              selectedType === type && styles.filterChipActive
            ]}
          >
            <Text style={[
              styles.filterText,
              selectedType === type && styles.filterTextActive
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(searchTerm || selectedType !== 'Todos') && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            {searchTerm && `Busca: "${searchTerm}"`}
            {searchTerm && selectedType !== 'Todos' && ' • '}
            {selectedType !== 'Todos' && `Tipo: ${selectedType}`}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <MovieCard 
            item={item} 
            onAdd={() => addFavorite(item)} 
            onPress={() => router.push({
              pathname: '/details/[id]',
              params: { id: item.id, item: JSON.stringify(item) }
            })} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              Nenhum resultado encontrado
            </Text>
            <Text style={styles.emptySubtext}>
              Tente buscar por outro termo
            </Text>
            <TouchableOpacity onPress={clearSearch} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  resultCount: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  activeFiltersContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  activeFiltersText: {
    fontSize: 13,
    color: '#1976d2',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});