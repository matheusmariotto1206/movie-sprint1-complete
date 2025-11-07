import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function RatingStars({ rating = 0, onRate, size = 32, readonly = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const stars = [1, 2, 3, 4, 5];
  
  const handlePress = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  const getStarIcon = (index) => {
    const currentRating = hoverRating || rating;
    if (currentRating >= index) {
      return '⭐'; // Estrela cheia
    } else if (currentRating >= index - 0.5) {
      return '✨'; // Meia estrela
    }
    return '☆'; // Estrela vazia
  };

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={readonly}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {getStarIcon(star)}
          </Text>
        </TouchableOpacity>
      ))}
      {rating > 0 && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginHorizontal: 2,
  },
  star: {
    color: '#FFA000',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});