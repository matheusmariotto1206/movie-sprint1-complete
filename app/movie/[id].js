import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMovie } from '../../hooks/useMovies';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMovieGenre, getMoviePoster, getMovieTitle, getMovieYear } from '../../utils/movie';

export default function MovieDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const movieId = Number(id);

  const { data: movie, isLoading, error } = useMovie(movieId);
  const { data: favorites } = useFavorites(user?.id, user?.name);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorite = favorites?.some((f) => f.id === movieId);

  const toggleFavorite = () => {
    if (!user?.id) {
      Alert.alert('Login necessário', 'Crie uma conta ou entre para salvar favoritos.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir para login', onPress: () => router.replace('/login') },
      ]);
      return;
    }
    const movieTitle = getMovieTitle(movie);

    if (isFavorite) {
      removeFavorite.mutate({ userId: user.id, userName: user.name, movieId });
    } else {
      addFavorite.mutate({ userId: user.id, userName: user.name, movieId, movieTitle });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Filme não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const poster = getMoviePoster(movie);

  return (
    <>
      <Stack.Screen
        options={{
          title: getMovieTitle(movie),
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterText}>🎬</Text>
          </View>
        )}
        <Text style={styles.title}>{getMovieTitle(movie)}</Text>
        <Text style={styles.meta}>{getMovieGenre(movie)}</Text>
        <Text style={styles.meta}>{getMovieYear(movie)}</Text>
        {movie.averageRating > 0 && (
          <Text style={styles.rating}>⭐ {Number(movie.averageRating).toFixed(1)}</Text>
        )}
        {movie.description ? <Text style={styles.description}>{movie.description}</Text> : null}

        <TouchableOpacity
          style={[styles.favBtn, isFavorite && styles.favBtnActive]}
          onPress={toggleFavorite}
          disabled={addFavorite.isPending || removeFavorite.isPending}
        >
          <Text style={styles.favBtnText}>
            {addFavorite.isPending || removeFavorite.isPending
              ? 'Salvando...'
              : isFavorite
                ? '♥ Remover dos favoritos'
                : '♡ Adicionar aos favoritos'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    content: { padding: 20, alignItems: 'center' },
    center: { flex: 1, backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' },
    poster: { width: 200, height: 300, borderRadius: 12, marginBottom: 20 },
    noPoster: { backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' },
    noPosterText: { fontSize: 48 },
    title: { color: c.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    meta: { color: c.textSecondary, fontSize: 16, marginBottom: 4 },
    rating: { color: c.accent, fontSize: 18, marginTop: 8, marginBottom: 16 },
    description: { color: c.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 24, textAlign: 'center' },
    favBtn: {
      backgroundColor: c.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
    },
    favBtnActive: { backgroundColor: c.primaryMuted },
    favBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    error: { color: c.error, marginBottom: 12 },
    link: { color: c.primary },
  });
