import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MovieCard({ 
  item, 
  onAdd, 
  onPress, 
  onRate, 
  onAddToPlaylist,
  showRateButton = true,
  showPlaylistButton = true,
  showFavoriteButton = true,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      {item.poster && (
        <Image 
          source={{ uri: item.poster }} 
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.type} • ⭐ {item.rating ? item.rating.toFixed(1) : 'N/A'}
        </Text>
        <Text numberOfLines={3} style={styles.description}>
          {item.description || 'Sem descrição disponível'}
        </Text>
        
        <View style={styles.buttonsContainer}>
          {showFavoriteButton && (
            <TouchableOpacity 
              onPress={(e) => { 
                e.stopPropagation(); 
                onAdd(); 
              }} 
              style={[styles.button, styles.favoriteButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>❤️</Text>
            </TouchableOpacity>
          )}
          
          {showRateButton && onRate && (
            <TouchableOpacity 
              onPress={(e) => { 
                e.stopPropagation(); 
                onRate(); 
              }} 
              style={[styles.button, styles.rateButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>⭐</Text>
            </TouchableOpacity>
          )}
          
          {showPlaylistButton && onAddToPlaylist && (
            <TouchableOpacity 
              onPress={(e) => { 
                e.stopPropagation(); 
                onAddToPlaylist(item);
              }} 
              style={[styles.button, styles.playlistButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>📁</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  meta: {
    color: '#666',
    fontSize: 13,
    marginBottom: 6,
  },
  description: {
    color: '#555',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    backgroundColor: '#e74c3c',
  },
  rateButton: {
    backgroundColor: '#FFA000',
  },
  playlistButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 18,
  },
});