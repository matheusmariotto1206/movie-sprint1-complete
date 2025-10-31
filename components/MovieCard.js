import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovieCard({ item, onAdd, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
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
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>➕ Adicionar aos favoritos</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
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
    lineHeight: 20,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});