import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';

export default function DetailsScreen({ route }) {
  const { item } = route.params || {};
  
  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❌</Text>
        <Text style={styles.emptyText}>Nenhum detalhe disponível.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      <View style={styles.header}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.genre}>{item.genre}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>📝 Sinopse</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo:</Text>
            <Text style={styles.infoValue}>{item.type}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gênero:</Text>
            <Text style={styles.infoValue}>{item.genre}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 24,
    paddingTop: 32,
  },
  type: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genre: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  infoValue: {
    color: '#555',
    flex: 1,
  },
});