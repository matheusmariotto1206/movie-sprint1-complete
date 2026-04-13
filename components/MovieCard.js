import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(movie)}>
      <Image
        source={{ uri: movie.poster_url || 'https://via.placeholder.com/120x180' }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.titulo}</Text>
        <Text style={styles.genre}>{movie.genero}</Text>
        <Text style={styles.year}>{movie.ano}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poster: { width: 100, height: 150 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  genre: { color: '#aaa', fontSize: 13 },
  year: { color: '#888', fontSize: 12, marginTop: 4 },
});
