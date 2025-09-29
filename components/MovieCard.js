import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovieCard({ item, onAdd, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.genre} • {item.type}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {item.description}
      </Text>
      <TouchableOpacity 
        onPress={(e) => { 
          e.stopPropagation(); 
          onAdd(); 
        }} 
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Adicionar aos favoritos</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  meta: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});