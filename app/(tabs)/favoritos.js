import React, { useCallback, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
        </Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você não tem favoritos ainda.</Text>
          <Text style={styles.emptySubtext}>
            Adicione filmes e séries da aba Sugestões!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.genre} • {item.type}</Text>
                <Text numberOfLines={2} style={styles.description}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  onPress={() => router.push({
                    pathname: '/details/[id]',
                    params: { id: item.id, item: JSON.stringify(item) }
                  })} 
                  style={[styles.button, styles.viewButton]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Ver Detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => removeFavorite(item.id)} 
                  style={[styles.button, styles.removeButton]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardContent: {
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  meta: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  description: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 14,
  },
});