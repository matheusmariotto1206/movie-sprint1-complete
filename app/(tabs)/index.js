import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert, StyleSheet, StatusBar, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import MovieCard from '../../components/MovieCard';
import DetailsModal from '../../components/DetailsModal';
import ReviewModal from '../../components/ReviewModal';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPopularMovies, getPopularTVShows, searchMovies, searchTVShows } from '../../services/tmdbService';

export default function SuggestionsScreen() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);
  const [itemToAddPlaylist, setItemToAddPlaylist] = useState(null);

  useEffect(() => {
    loadFavorites();
    loadReviews();
    loadMoviesFromAPI();
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      searchMoviesFromAPI();
    } else if (searchTerm.trim().length === 0) {
      loadMoviesFromAPI();
    }
  }, [searchTerm]);

  useEffect(() => {
    filterByType();
  }, [selectedType, movies]);

  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      setFavorites(json ? JSON.parse(json) : []);
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
    }
  };

  const loadReviews = async () => {
    try {
      const json = await AsyncStorage.getItem('reviews');
      setReviews(json ? JSON.parse(json) : []);
    } catch (e) {
      console.error('Erro ao carregar avaliações:', e);
    }
  };

  const loadMoviesFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const [movieResults, tvResults] = await Promise.all([
        getPopularMovies(1),
        getPopularTVShows(1)
      ]);
      
      const combined = [...movieResults, ...tvResults];
      setMovies(combined);
      setFilteredMovies(combined);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar filmes e séries. Verifique sua conexão.');
      Alert.alert('Erro', 'Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const searchMoviesFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const [movieResults, tvResults] = await Promise.all([
        searchMovies(searchTerm),
        searchTVShows(searchTerm)
      ]);
      
      const combined = [...movieResults, ...tvResults];
      setMovies(combined);
      filterByType(combined);
    } catch (err) {
      console.error('Erro ao buscar:', err);
      setError('Erro na busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filterByType = (data = movies) => {
    if (selectedType === 'Todos') {
      setFilteredMovies(data);
    } else {
      setFilteredMovies(data.filter(item => item.type === selectedType));
    }
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
      Alert.alert('Sucesso ✅', 'Adicionado aos favoritos!');
    } catch (e) {
      console.error('Erro ao adicionar favorito:', e);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const saveReview = async (review) => {
    try {
      const existingIndex = reviews.findIndex(r => r.id === review.id);
      let updatedReviews;

      if (existingIndex >= 0) {
        updatedReviews = [...reviews];
        updatedReviews[existingIndex] = review;
      } else {
        updatedReviews = [review, ...reviews];
      }

      setReviews(updatedReviews);
      await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
      await loadReviews();
    } catch (e) {
      console.error('Erro ao salvar avaliação:', e);
    }
  };

  const openDetails = (item) => {
    setSelectedMovie(item);
    setModalVisible(true);
  };

  const closeDetails = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const openRateModal = (item) => {
    setItemToRate(item);
    setReviewModalVisible(true);
  };

  const closeRateModal = () => {
    setReviewModalVisible(false);
    setItemToRate(null);
  };

  const openPlaylistModal = (item) => {
    setItemToAddPlaylist(item);
    setTimeout(() => {
      setPlaylistModalVisible(true);
    }, 100);
  };

  const closePlaylistModal = () => {
    setPlaylistModalVisible(false);
    setTimeout(() => {
      setItemToAddPlaylist(null);
    }, 300);
  };

  const onPlaylistSuccess = () => {
    loadFavorites();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedType('Todos');
    loadMoviesFromAPI();
  };

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.headerInfo}>
        <Text style={styles.resultCount}>
          {filteredMovies.length} títulos {searchTerm ? 'encontrados' : 'disponíveis'}
        </Text>
        {loading && <ActivityIndicator size="small" color="#2196F3" />}
      </View>
      
      <View style={styles.searchInputWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes ou séries (min. 3 caracteres)..."
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

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadMoviesFromAPI} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
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
            onPress={() => openDetails(item)}
            onRate={() => openRateModal(item)}
            onAddToPlaylist={() => openPlaylistModal(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
              <Text style={styles.emptySubtext}>Tente buscar por outro termo</Text>
              <TouchableOpacity onPress={clearSearch} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        refreshing={loading}
        onRefresh={loadMoviesFromAPI}
      />

      <DetailsModal 
        visible={modalVisible}
        item={selectedMovie}
        onClose={closeDetails}
      />

      <ReviewModal
        visible={reviewModalVisible}
        item={itemToRate}
        onClose={closeRateModal}
        onSave={saveReview}
        existingReview={reviews.find(r => r.id === itemToRate?.id)}
      />

      <AddToPlaylistModal
        visible={playlistModalVisible}
        item={itemToAddPlaylist}
        onClose={closePlaylistModal}
        onSuccess={onPlaylistSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 13,
    color: '#666',
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
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 13,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#c62828',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
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