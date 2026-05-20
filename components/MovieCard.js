import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getMovieGenre, getMoviePoster, getMovieTitle, getMovieYear } from '../utils/movie';

export default function MovieCard({ movie, onPress, rightAction }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const poster = getMoviePoster(movie);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(movie)} activeOpacity={0.85}>
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>🎬</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{getMovieTitle(movie)}</Text>
        <Text style={styles.genre}>{getMovieGenre(movie)}</Text>
        <Text style={styles.year}>{getMovieYear(movie)}</Text>
      </View>
      {rightAction}
    </TouchableOpacity>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: c.card,
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    poster: { width: 80, height: 120 },
    noPoster: { backgroundColor: c.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
    noPosterText: { fontSize: 28 },
    info: { flex: 1, padding: 12, justifyContent: 'center' },
    title: { color: c.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    genre: { color: c.textSecondary, fontSize: 13 },
    year: { color: c.textMuted, fontSize: 12, marginTop: 4 },
  });
