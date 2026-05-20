import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites, useRemoveFavorite } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMoviePoster, getMovieTitle } from '../../utils/movie';

export default function FavoritosScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user } = useAuth();
  const { data: favorites, isLoading } = useFavorites(user?.id);
  const removeFavorite = useRemoveFavorite();

  const handleRemove = (movie) => {
    Alert.alert('Remover dos favoritos?', getMovieTitle(movie), [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeFavorite.mutate({ userId: user.id, movieId: movie.id }) },
    ]);
  };

  if (!user?.id) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Faça login</Text>
        <Text style={styles.empty}>Entre na conta para ver seus favoritos.</Text>
      </View>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const poster = getMoviePoster(item);
          return (
            <TouchableOpacity style={styles.row} onPress={() => router.push(`/movie/${item.id}`)}>
              {poster ? (
                <Image source={{ uri: poster }} style={styles.poster} />
              ) : (
                <View style={[styles.poster, styles.noPoster]}>
                  <Text>🎬</Text>
                </View>
              )}
              <Text style={styles.title} numberOfLines={2}>{getMovieTitle(item)}</Text>
              <TouchableOpacity onPress={() => handleRemove(item)} hitSlop={12}>
                <Text style={styles.heart}>♥</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>Nenhum favorito</Text>
            <Text style={styles.empty}>Toque em ♡ na aba Início para salvar filmes aqui.</Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    list: { padding: 16, paddingBottom: 24 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 10,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    poster: { width: 48, height: 72, borderRadius: 6, marginRight: 12 },
    noPoster: { backgroundColor: c.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
    title: { flex: 1, color: c.text, fontSize: 15, fontWeight: '600' },
    heart: { color: c.primary, fontSize: 22, paddingHorizontal: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyTitle: { color: c.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    empty: { color: c.textMuted, textAlign: 'center', lineHeight: 22 },
  });
