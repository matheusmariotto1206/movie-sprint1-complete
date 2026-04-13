import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useMovies } from '../../hooks/useMovies';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HomeScreen() {
  const { data: movies, isLoading, error, refetch } = useMovies();

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <View style={styles.centerContainer}>
      <Text style={styles.error}>Erro ao carregar dados</Text>
      <Text style={styles.errorDetail}>{error.message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
        <Text style={styles.retryText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.posterUrl ? (
              <Image source={{ uri: item.posterUrl }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.noPoster]}>
                <Text style={styles.noPosterText}>🎬</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
              <Text style={styles.year}>{item.releaseDate}</Text>
              {item.averageRating > 0 && (
                <Text style={styles.rating}>⭐ {item.averageRating.toFixed(1)}</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum filme encontrado</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  centerContainer: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center', padding: 20 },
  error: { color: '#E50914', fontSize: 16, marginBottom: 8 },
  errorDetail: { color: '#999', fontSize: 12, marginBottom: 16, textAlign: 'center' },
  retryBtn: { backgroundColor: '#E50914', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  poster: { width: 80, height: 120 },
  noPoster: { backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center' },
  noPosterText: { fontSize: 30 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  genre: { color: '#aaa', fontSize: 13, marginBottom: 2 },
  year: { color: '#888', fontSize: 12 },
  rating: { color: '#ffd700', fontSize: 13, marginTop: 4 },
});
