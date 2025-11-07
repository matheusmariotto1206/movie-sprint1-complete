import React, { useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import RatingStars from '../../components/RatingStars';
import ReviewModal from '../../components/ReviewModal';

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'rating'

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  const loadReviews = async () => {
    try {
      const json = await AsyncStorage.getItem('reviews');
      const loadedReviews = json ? JSON.parse(json) : [];
      setReviews(loadedReviews);
    } catch (e) {
      console.log('Erro ao carregar avaliações:', e);
    }
  };

  const saveReview = async (review) => {
    try {
      const existingIndex = reviews.findIndex(r => r.id === review.id);
      let updatedReviews;

      if (existingIndex >= 0) {
        // Atualizar review existente
        updatedReviews = [...reviews];
        updatedReviews[existingIndex] = review;
        Alert.alert('Sucesso! ✅', 'Avaliação atualizada com sucesso!');
      } else {
        // Nova review
        updatedReviews = [review, ...reviews];
        Alert.alert('Sucesso! ✅', 'Avaliação salva com sucesso!');
      }

      setReviews(updatedReviews);
      await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
    } catch (e) {
      console.log('Erro ao salvar avaliação:', e);
      Alert.alert('Erro', 'Não foi possível salvar a avaliação.');
    }
  };

  const deleteReview = async (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedReviews = reviews.filter(r => r.id !== id);
              setReviews(updatedReviews);
              await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
              Alert.alert('Removido ✅', 'Avaliação excluída com sucesso.');
            } catch (e) {
              console.log('Erro ao excluir avaliação:', e);
              Alert.alert('Erro', 'Não foi possível excluir a avaliação.');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (review) => {
    setSelectedItem({
      id: review.id,
      title: review.itemTitle,
      type: review.itemType,
      poster: review.itemPoster,
      genre: review.itemGenre,
    });
    setEditingReview(review);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setEditingReview(null);
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    if (sortBy === 'date') {
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'rating') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  };

  const getStats = () => {
    if (reviews.length === 0) return { avg: 0, total: 0, movies: 0, series: 0 };
    
    const total = reviews.length;
    const movies = reviews.filter(r => r.itemType === 'Filme').length;
    const series = reviews.filter(r => r.itemType === 'Série').length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / total;

    return { avg, total, movies, series };
  };

  const stats = getStats();

  const renderHeader = () => (
    <View>
      {/* Estatísticas */}
      <View style={styles.statsSection}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{stats.total}</Text>
          <Text style={styles.statsLabel}>Avaliações</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{stats.avg.toFixed(1)}</Text>
          <Text style={styles.statsLabel}>Média ⭐</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{stats.movies}</Text>
          <Text style={styles.statsLabel}>Filmes</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{stats.series}</Text>
          <Text style={styles.statsLabel}>Séries</Text>
        </View>
      </View>

      {/* Ordenação */}
      {reviews.length > 0 && (
        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
              onPress={() => setSortBy('date')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
                📅 Mais recentes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>
                ⭐ Melhor nota
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        {item.itemPoster ? (
          <Image source={{ uri: item.itemPoster }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderIcon}>🎬</Text>
          </View>
        )}
        
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewTitle} numberOfLines={2}>{item.itemTitle}</Text>
          <Text style={styles.reviewMeta}>{item.itemType} • {item.itemGenre}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={item.rating} readonly size={20} />
          </View>
          <Text style={styles.reviewDate}>
            {new Date(item.date).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {item.comment && (
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>💭 Seu comentário:</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      )}

      <View style={styles.reviewActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteReview(item.id)}
        >
          <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>Nenhuma avaliação ainda</Text>
          <Text style={styles.emptyText}>
            Avalie filmes e séries para começar a construir seu histórico!
          </Text>
          <Text style={styles.emptyHint}>
            💡 Dica: Vá até a aba Sugestões ou Favoritos e clique em "Avaliar"
          </Text>
        </View>
      ) : (
        <FlatList
          data={getSortedReviews()}
          keyExtractor={(item) => item.id + item.date}
          renderItem={renderReview}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ReviewModal
        visible={modalVisible}
        item={selectedItem}
        onClose={closeModal}
        onSave={saveReview}
        existingReview={editingReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statsLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  sortSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  poster: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 12,
  },
  posterPlaceholder: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderIcon: {
    fontSize: 32,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reviewMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  commentSection: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  emptyHint: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});