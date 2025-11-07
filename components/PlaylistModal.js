import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

const EMOJI_OPTIONS = [
  '🎬', '🍿', '🎥', '📺', '🎭', '🎪', 
  '🔥', '❤️', '⭐', '🌟', '💫', '✨',
  '😂', '😱', '🚀', '👻', '🦸', '🧙',
];

export default function PlaylistModal({ visible, onClose, onSave, editingPlaylist = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎬');

  useEffect(() => {
    if (editingPlaylist) {
      setName(editingPlaylist.name);
      setDescription(editingPlaylist.description || '');
      setSelectedEmoji(editingPlaylist.icon);
    } else {
      setName('');
      setDescription('');
      setSelectedEmoji('🎬');
    }
  }, [editingPlaylist, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Por favor, dê um nome para sua playlist!');
      return;
    }

    const playlist = {
      id: editingPlaylist ? editingPlaylist.id : `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon: selectedEmoji,
      items: editingPlaylist ? editingPlaylist.items : [],
      createdAt: editingPlaylist ? editingPlaylist.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(playlist);
    setName('');
    setDescription('');
    setSelectedEmoji('🎬');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {editingPlaylist ? 'Editar Playlist' : 'Nova Playlist'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Nome */}
            <View style={styles.section}>
              <Text style={styles.label}>🏷️ Nome da Playlist</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Filmes para Assistir"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                maxLength={50}
              />
              <Text style={styles.charCount}>{name.length}/50</Text>
            </View>

            {/* Descrição */}
            <View style={styles.section}>
              <Text style={styles.label}>📝 Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o tema da playlist..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={150}
              />
              <Text style={styles.charCount}>{description.length}/150</Text>
            </View>

            {/* Emoji */}
            <View style={styles.section}>
              <Text style={styles.label}>😀 Escolha um ícone</Text>
              <View style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonSelected,
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>👁️ Preview:</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewIcon}>
                  <Text style={styles.previewIconText}>{selectedEmoji}</Text>
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {name || 'Nome da Playlist'}
                  </Text>
                  <Text style={styles.previewDescription}>
                    {description || 'Sem descrição'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>
                  {editingPlaylist ? '✓ Salvar' : '✓ Criar Playlist'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '85%',
    paddingBottom: 20,
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
  section: {
    padding: 20,
    paddingTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  emojiText: {
    fontSize: 28,
  },
  previewSection: {
    padding: 20,
    paddingTop: 10,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  previewCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 24,
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  previewDescription: {
    fontSize: 13,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});