import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import RatingStars from './RatingStars';

export default function ReviewModal({ visible, item, onClose, onSave, existingReview = null }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [existingReview, visible]);

  const handleSave = () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota de 1 a 5 estrelas!');
      return;
    }

    const review = {
      id: item.id,
      itemTitle: item.title,
      itemType: item.type,
      itemPoster: item.poster,
      itemGenre: item.genre,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    onSave(review);
    setRating(0);
    setComment('');
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {existingReview ? 'Editar Avaliação' : 'Avaliar Conteúdo'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Info do Item */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemMeta}>{item.type} • {item.genre}</Text>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={styles.label}>⭐ Sua nota:</Text>
              <View style={styles.ratingContainer}>
                <RatingStars 
                  rating={rating} 
                  onRate={setRating}
                  size={40}
                />
              </View>
              {rating > 0 && (
                <Text style={styles.ratingDescription}>
                  {rating === 1 && '😞 Péssimo'}
                  {rating === 2 && '😐 Ruim'}
                  {rating === 3 && '🙂 Regular'}
                  {rating === 4 && '😊 Bom'}
                  {rating === 5 && '🤩 Excelente'}
                </Text>
              )}
            </View>

            {/* Comentário */}
            <View style={styles.section}>
              <Text style={styles.label}>💭 Seu comentário (opcional):</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="O que você achou? Compartilhe sua opinião..."
                placeholderTextColor="#999"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>{comment.length}/500 caracteres</Text>
            </View>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.button, styles.cancelButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.button, styles.saveButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>
                  {existingReview ? '✓ Atualizar' : '✓ Salvar Avaliação'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
  itemInfo: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    paddingTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ratingDescription: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 120,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
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
    backgroundColor: '#27ae60',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});