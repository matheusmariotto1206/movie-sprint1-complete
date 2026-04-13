import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFavorites, useRemoveFavorite } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import MovieCard from '../../components/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function FavoritosScreen() {
  const { user } = useAuth();
  const { data: favorites, isLoading } = useFavorites(user?.id);
  const removeFavorite = useRemoveFavorite();

  const handleRemove = (movieId) => {
    Alert.alert('Remover', 'Remover dos favoritos?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => removeFavorite.mutate({ userId: user.id, movieId }),
      },
    ]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => handleRemove(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum favorito ainda</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
