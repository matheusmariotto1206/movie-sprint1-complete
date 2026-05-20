import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMovies } from '../../hooks/useMovies';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMovieGenre, getMoviePoster, getMovieTitle, getMovieYear } from '../../utils/movie';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user } = useAuth();
  const { data: movies, isLoading, error, refetch } = useMovies();
  const { data: favorites } = useFavorites(user?.id);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorite = (movieId) => favorites?.some((f) => f.id === movieId);

  const toggleFavorite = (movieId) => {
    if (!user?.id) {
      Alert.alert('Login necessário', 'Entre na conta para salvar favoritos');
      return;
    }
    const movie = movies?.find((m) => m.id === movieId);
    const movieTitle = getMovieTitle(movie);

    if (isFavorite(movieId)) {
      removeFavorite.mutate({ userId: user.id, movieId }, { onError: (err) => Alert.alert('Erro', err.message) });
    } else {
      addFavorite.mutate(
        { userId: user.id, movieId, movieTitle },
        { onError: (err) => Alert.alert('Erro', err.message) }
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>Erro ao carregar dados</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const poster = getMoviePoster(item);
          const fav = isFavorite(item.id);
          return (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/movie/${item.id}`)} activeOpacity={0.85}>
              {poster ? (
                <Image source={{ uri: poster }} style={styles.poster} />
              ) : (
                <View style={[styles.poster, styles.noPoster]}>
                  <Text style={styles.noPosterText}>🎬</Text>
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.title}>{getMovieTitle(item)}</Text>
                <Text style={styles.genre}>{getMovieGenre(item)}</Text>
                <Text style={styles.year}>{getMovieYear(item)}</Text>
                {item.averageRating > 0 && (
                  <Text style={styles.rating}>⭐ {Number(item.averageRating).toFixed(1)}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item.id)}>
                <Text style={styles.favIcon}>{fav ? '♥' : '♡'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum filme encontrado</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centerContainer: { flex: 1, backgroundColor: c.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
    error: { color: c.error, fontSize: 16, marginBottom: 8 },
    errorDetail: { color: c.textMuted, fontSize: 12, marginBottom: 16, textAlign: 'center' },
    retryBtn: { backgroundColor: c.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText: { color: '#fff', fontWeight: 'bold' },
    empty: { color: c.textMuted, textAlign: 'center', marginTop: 40 },
    card: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 12, marginBottom: 12, overflow: 'hidden', alignItems: 'center', borderWidth: 1, borderColor: c.border },
    poster: { width: 80, height: 120 },
    noPoster: { backgroundColor: c.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
    noPosterText: { fontSize: 30 },
    info: { flex: 1, padding: 12, justifyContent: 'center' },
    title: { color: c.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    genre: { color: c.textSecondary, fontSize: 13, marginBottom: 2 },
    year: { color: c.textMuted, fontSize: 12 },
    rating: { color: c.accent, fontSize: 13, marginTop: 4 },
    favBtn: { padding: 16, justifyContent: 'center' },
    favIcon: { fontSize: 28, color: c.primary },
  });
