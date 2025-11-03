import React, { useCallback, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, StyleSheet, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import DetailsModal from '../../components/DetailsModal';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      setFavorites(json ? JSON.parse(json) : []);
    } catch (e) {
      console.log('Erro ao carregar favoritos:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja remover este item dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const newFavs = favorites.filter(f => f.id !== id);
              setFavorites(newFavs);
              await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
              Alert.alert('Removido', 'Item removido dos favoritos.');
            } catch (e) {
              console.log('Erro ao remover favorito:', e);
              Alert.alert('Erro', 'Não foi possível remover o item.');
            }
          },
        },
      ]
    );
  };

  const openDetails = (item) => {
    setSelectedMovie(item);
    setModalVisible(true);
  };

  const closeDetails = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>🎬</Text>
          </View>
        )}
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.meta}>{item.genre} • {item.type}</Text>
          
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
            </View>
          )}
          
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          onPress={() => openDetails(item)} 
          style={[styles.button, styles.viewButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>👁️ Ver Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => removeFavorite(item.id)} 
          style={[styles.button, styles.removeButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🗑️ Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⭐ Meus Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
        </Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyText}>Você não tem favoritos ainda.</Text>
          <Text style={styles.emptySubtext}>
            Adicione filmes e séries da aba Sugestões!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Detalhes */}
      <DetailsModal 
        visible={modalVisible}
        item={selectedMovie}
        onClose={closeDetails}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  posterPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  meta: {
    color: '#666',
    fontSize: 13,
    marginBottom: 6,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFA000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    color: '#555',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});