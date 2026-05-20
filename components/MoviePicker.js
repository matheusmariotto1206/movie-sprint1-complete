import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useMovies } from '../hooks/useMovies';
import { useTheme } from '../contexts/ThemeContext';
import { getMovieTitle } from '../utils/movie';

export default function MoviePicker({ selectedId, onSelect }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: movies, isLoading } = useMovies();

  if (isLoading) {
    return <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Filme</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(movies || []).map((movie) => {
          const active = selectedId === movie.id;
          return (
            <TouchableOpacity
              key={movie.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(movie.id)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                {getMovieTitle(movie)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    wrap: { marginBottom: 12 },
    label: { color: c.textSecondary, fontSize: 13, marginBottom: 8 },
    chip: {
      backgroundColor: c.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 8,
      maxWidth: 160,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { color: c.textSecondary, fontSize: 13 },
    chipTextActive: { color: '#fff', fontWeight: 'bold' },
  });
