import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddToPlaylistModal({ visible, item, onClose, onSuccess }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (visible && item) {
      loadPlaylists();
    }
  }, [visible, item]);

  const loadPlaylists = async () => {
    try {
      const json = await AsyncStorage.getItem('playlists');
      const loadedPlaylists = json ? JSON.parse(json) : [];
      setPlaylists(loadedPlaylists);
    } catch (e) {
      console.error('Erro ao carregar playlists:', e);
    }
  };

  const handleAddToPlaylist = async (playlist) => {
    try {
      const alreadyExists = playlist.items?.some(i => i.id === item.id) || false;

      if (alreadyExists) {
        Alert.alert('Atenção', 'Este item já está nesta playlist!');
        return;
      }

      const updatedPlaylist = {
        ...playlist,
        items: [...(playlist.items || []), item],
        updatedAt: new Date().toISOString(),
      };

      const updatedPlaylists = playlists.map(p =>
        p.id === playlist.id ? updatedPlaylist : p
      );

      await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      
      Alert.alert(
        'Sucesso! ✅',
        `"${item.title}" foi adicionado à playlist "${playlist.name}"!`,
        [{ 
          text: 'OK', 
          onPress: () => {
            if (onSuccess) onSuccess();
            onClose();
          }
        }]
      );
    } catch (e) {
      console.error('Erro ao adicionar à playlist:', e);
      Alert.alert('Erro', 'Não foi possível adicionar à playlist. Tente novamente.');
    }
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Adicionar à Playlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.itemMeta}>
              {item.type} • {item.genre}
            </Text>
          </View>

          {playlists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={styles.emptyText}>
                Você ainda não tem playlists
              </Text>
              <Text style={styles.emptySubtext}>
                Crie sua primeira playlist na aba Playlists!
              </Text>
            </View>
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item: playlist }) => {
                const hasItem = playlist.items?.some(i => i.id === item.id) || false;

                return (
                  <TouchableOpacity
                    style={[
                      styles.playlistItem,
                      hasItem && styles.playlistItemDisabled
                    ]}
                    onPress={() => {
                      if (!hasItem) {
                        handleAddToPlaylist(playlist);
                      }
                    }}
                    activeOpacity={0.7}
                    disabled={hasItem}
                  >
                    <View style={styles.playlistIcon}>
                      <Text style={styles.playlistIconText}>{playlist.icon}</Text>
                    </View>
                    <View style={styles.playlistInfo}>
                      <Text style={styles.playlistName}>{playlist.name}</Text>
                      <Text style={styles.playlistCount}>
                        {playlist.items?.length || 0} {(playlist.items?.length || 0) === 1 ? 'item' : 'itens'}
                      </Text>
                    </View>
                    {hasItem ? (
                      <Text style={styles.checkmark}>✓</Text>
                    ) : (
                      <Text style={styles.arrow}>›</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  itemInfo: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  playlistItemDisabled: {
    opacity: 0.5,
    backgroundColor: '#f9f9f9',
  },
  playlistIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistIconText: {
    fontSize: 22,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  playlistCount: {
    fontSize: 13,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
  checkmark: {
    fontSize: 24,
    color: '#27ae60',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});