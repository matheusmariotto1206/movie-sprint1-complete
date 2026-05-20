import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function StarRating({ value, onChange }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)} style={styles.starBtn}>
          <Text style={[styles.star, star <= value && styles.starActive]}>
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
    starBtn: { padding: 4 },
    star: { fontSize: 32, color: c.border },
    starActive: { color: c.accent },
  });
