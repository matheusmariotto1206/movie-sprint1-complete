import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTopMovies } from '../../hooks/useTopMovies';

export default function TopMoviesScreen() {
  const { movies, loading, error, refetch } = useTopMovies();

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#E50914" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Top Filmes por Nota</Text>
      <Text style={styles.subtitle}>Dados do Oracle APEX</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>⭐ {item.average_rating}</Text>
              <Text style={styles.reviews}>{item.total_reviews} reviews</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 50, marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', borderRadius: 12, padding: 14, marginBottom: 10 },
  rank: { fontSize: 20, fontWeight: 'bold', color: '#E50914', width: 40 },
  info: { flex: 1 },
  movieTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  genre: { fontSize: 13, color: '#aaa', marginTop: 2 },
  ratingBox: { alignItems: 'flex-end' },
  rating: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
  reviews: { fontSize: 12, color: '#888', marginTop: 2 },
  error: { color: '#E50914', fontSize: 16 },
});
