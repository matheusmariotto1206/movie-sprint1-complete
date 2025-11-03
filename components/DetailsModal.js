import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';

export default function DetailsModal({ visible, item, onClose }) {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView>
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕ Fechar</Text>
          </TouchableOpacity>

          {/* Imagem do Poster */}
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.posterImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.header}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.genre}>{item.genre}</Text>
            
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}/10</Text>
              </View>
            )}
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
              
              {item.releaseDate && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Lançamento:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(item.releaseDate).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              )}
              
              {item.runtime && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Duração:</Text>
                  <Text style={styles.infoValue}>{item.runtime} minutos</Text>
                </View>
              )}
              
              {item.seasons && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Temporadas:</Text>
                  <Text style={styles.infoValue}>{item.seasons}</Text>
                </View>
              )}
              
              {item.episodes && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Episódios:</Text>
                  <Text style={styles.infoValue}>{item.episodes}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  posterImage: {
    width: '100%',
    height: 300,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 24,
    paddingTop: 20,
  },
  type: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genre: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.9,
    marginBottom: 12,
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFA000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
    marginBottom: 24,
    textAlign: 'justify',
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#333',
    width: 110,
  },
  infoValue: {
    color: '#555',
    flex: 1,
  },
});