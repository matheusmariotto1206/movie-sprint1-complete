import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTopMovies } from '../../hooks/useTopMovies';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const getRating = (item) => item.average_rating ?? item.averageRating ?? '-';
const getReviews = (item) => item.total_reviews ?? item.totalReviews ?? 0;

export default function TopMoviesScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: movies, isLoading, isFetching, error, refetch, isRefetching } = useTopMovies();

  if (isLoading && !error) return <LoadingSpinner />;
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar ranking</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Top Filmes por Nota</Text>
      <Text style={styles.subtitle}>
        Ranking calculado no Oracle APEX (média de reviews, filtro e ordenação)
      </Text>
      {(isRefetching || isFetching) && <Text style={styles.refreshing}>Atualizando...</Text>}
      <FlatList
        data={movies || []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>⭐ {getRating(item)}</Text>
              <Text style={styles.reviews}>{getReviews(item)} reviews</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum filme no ranking</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.exploreBg, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.exploreBg, padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', color: c.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: c.textMuted, marginBottom: 16, lineHeight: 20 },
    refreshing: { color: c.primary, fontSize: 12, marginBottom: 8 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.exploreCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: c.border,
    },
    rank: { fontSize: 20, fontWeight: 'bold', color: c.primary, width: 40 },
    info: { flex: 1 },
    movieTitle: { fontSize: 16, fontWeight: '600', color: c.text },
    genre: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
    ratingBox: { alignItems: 'flex-end' },
    rating: { fontSize: 16, fontWeight: 'bold', color: c.accent },
    reviews: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    error: { color: c.error, fontSize: 16, marginBottom: 8, textAlign: 'center' },
    errorDetail: { color: c.textMuted, fontSize: 12, marginBottom: 16, textAlign: 'center' },
    retryBtn: { backgroundColor: c.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    retryText: { color: '#fff', fontWeight: 'bold' },
    empty: { color: c.textMuted, textAlign: 'center', marginTop: 40 },
  });
