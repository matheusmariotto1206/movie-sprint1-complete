import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import PlaylistModal from '../../components/PlaylistModal';
import DetailsModal from '../../components/DetailsModal';

// Playlists padrão do sistema
const DEFAULT_PLAYLISTS = [
  {
    id: 'default-action',
    name: 'Ação de Respeito',
    description: 'Filmes e séries cheios de adrenalina',
    icon: '🔥',
    items: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-comedy',
    name: 'Comédia pra Relaxar',
    description: 'Risadas garantidas para descontrair',
    icon: '😂',
    items: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-scifi',
    name: 'Sci-Fi Clássico',
    description: 'O melhor da ficção científica',
    icon: '🚀',
    items: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-horror',
    name: 'Terror de Arrepiar',
    description: 'Para os corajosos de plantão',
    icon: '👻',
    items: [],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadPlaylists();
    }, [])
  );

  const loadPlaylists = async () => {
    try {
      const json = await AsyncStorage.getItem('playlists');
      let loadedPlaylists = json ? JSON.parse(json) : [];

      // Se não houver playlists, criar as padrões
      if (loadedPlaylists.length === 0) {
        loadedPlaylists = DEFAULT_PLAYLISTS;
        await AsyncStorage.setItem('playlists', JSON.stringify(loadedPlaylists));
      }

      setPlaylists(loadedPlaylists);
    } catch (e) {
      console.log('Erro ao carregar playlists:', e);
    }
  };

  const savePlaylist = async (playlist) => {
    try {
      const existingIndex = playlists.findIndex(p => p.id === playlist.id);
      let updatedPlaylists;

      if (existingIndex >= 0) {
        // Atualizar playlist existente
        updatedPlaylists = [...playlists];
        updatedPlaylists[existingIndex] = playlist;
        Alert.alert('Sucesso! ✅', 'Playlist atualizada com sucesso!');
      } else {
        // Nova playlist
        updatedPlaylists = [playlist, ...playlists];
        Alert.alert('Sucesso! ✅', 'Playlist criada com sucesso!');
      }

      setPlaylists(updatedPlaylists);
      await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
    } catch (e) {
      console.log('Erro ao salvar playlist:', e);
      Alert.alert('Erro', 'Não foi possível salvar a playlist.');
    }
  };

  const deletePlaylist = async (playlistId, isDefault) => {
    if (isDefault) {
      Alert.alert('Atenção', 'Playlists padrão não podem ser excluídas!');
      return;
    }

    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir esta playlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
              setPlaylists(updatedPlaylists);
              await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
              Alert.alert('Removido ✅', 'Playlist excluída com sucesso.');
            } catch (e) {
              console.log('Erro ao excluir playlist:', e);
              Alert.alert('Erro', 'Não foi possível excluir a playlist.');
            }
          },
        },
      ]
    );
  };

  const removeFromPlaylist = async (playlistId, itemId) => {
    Alert.alert(
      'Confirmar',
      'Deseja remover este item da playlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPlaylists = playlists.map(p => {
                if (p.id === playlistId) {
                  return {
                    ...p,
                    items: p.items.filter(i => i.id !== itemId),
                    updatedAt: new Date().toISOString(),
                  };
                }
                return p;
              });

              setPlaylists(updatedPlaylists);
              await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
              Alert.alert('Removido ✅', 'Item removido da playlist.');
            } catch (e) {
              console.log('Erro ao remover item:', e);
              Alert.alert('Erro', 'Não foi possível remover o item.');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (playlist) => {
    if (playlist.isDefault) {
      Alert.alert('Atenção', 'Playlists padrão não podem ser editadas!');
      return;
    }
    setEditingPlaylist(playlist);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPlaylist(null);
  };

  const toggleExpand = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setDetailsModalVisible(true);
  };

  const getTotalItems = () => {
    return playlists.reduce((sum, p) => sum + p.items.length, 0);
  };

  const renderPlaylistItem = (item, playlistId) => (
    <View key={item.id} style={styles.playlistItemCard}>
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => openItemDetails(item)}
        activeOpacity={0.7}
      >
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.itemPoster} />
        ) : (
          <View style={styles.itemPosterPlaceholder}>
            <Text style={styles.placeholderIcon}>🎬</Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.itemMeta}>{item.type} • {item.genre}</Text>
          {item.rating && (
            <Text style={styles.itemRating}>⭐ {item.rating.toFixed(1)}</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeItemButton}
        onPress={() => removeFromPlaylist(playlistId, item.id)}
      >
        <Text style={styles.removeItemText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylist = ({ item: playlist }) => {
    const isExpanded = expandedPlaylist === playlist.id;

    return (
      <View style={styles.playlistCard}>
        {/* Header da Playlist */}
        <TouchableOpacity
          style={styles.playlistHeader}
          onPress={() => toggleExpand(playlist.id)}
          activeOpacity={0.7}
        >
          <View style={styles.playlistIcon}>
            <Text style={styles.playlistIconText}>{playlist.icon}</Text>
          </View>
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            <Text style={styles.playlistDescription} numberOfLines={1}>
              {playlist.description || 'Sem descrição'}
            </Text>
            <Text style={styles.playlistCount}>
              {playlist.items.length} {playlist.items.length === 1 ? 'item' : 'itens'}
            </Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {/* Ações da Playlist */}
        <View style={styles.playlistActions}>
          {!playlist.isDefault && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => openEditModal(playlist)}
              >
                <Text style={styles.actionButtonText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deletePlaylist(playlist.id, playlist.isDefault)}
              >
                <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
              </TouchableOpacity>
            </>
          )}
          {playlist.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>⭐ Playlist Padrão</Text>
            </View>
          )}
        </View>

        {/* Items da Playlist (quando expandido) */}
        {isExpanded && (
          <View style={styles.playlistItemsContainer}>
            {playlist.items.length === 0 ? (
              <View style={styles.emptyPlaylist}>
                <Text style={styles.emptyPlaylistIcon}>📁</Text>
                <Text style={styles.emptyPlaylistText}>
                  Playlist vazia
                </Text>
                <Text style={styles.emptyPlaylistSubtext}>
                  Adicione filmes e séries da aba Sugestões ou Favoritos
                </Text>
              </View>
            ) : (
              playlist.items.map(item => renderPlaylistItem(item, playlist.id))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header com Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{playlists.length}</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{getTotalItems()}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
        </View>
      </View>

      {/* Lista de Playlists */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylist}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>Nenhuma playlist criada ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar sua primeira playlist!
            </Text>
          </View>
        }
      />

      {/* Botão Criar Playlist */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modals */}
      <PlaylistModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={savePlaylist}
        editingPlaylist={editingPlaylist}
      />

      <DetailsModal
        visible={detailsModalVisible}
        item={selectedItem}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  playlistCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  playlistIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistIconText: {
    fontSize: 28,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  playlistActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  defaultBadge: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#FFA000',
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  playlistItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  playlistItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
  },
  itemPoster: {
    width: 50,
    height: 75,
    borderRadius: 6,
    marginRight: 10,
  },
  itemPosterPlaceholder: {
    width: 50,
    height: 75,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderIcon: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemRating: {
    fontSize: 11,
    color: '#FFA000',
    fontWeight: '600',
  },
  removeItemButton: {
    padding: 8,
    marginLeft: 8,
  },
  removeItemText: {
    fontSize: 20,
    color: '#e74c3c',
  },
  emptyPlaylist: {
    alignItems: 'center',
    padding: 24,
  },
  emptyPlaylistIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyPlaylistText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptyPlaylistSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
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