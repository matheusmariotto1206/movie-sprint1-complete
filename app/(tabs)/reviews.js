import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from '../../hooks/useReviews';

export default function ReviewsScreen() {
  const [movieId, setMovieId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { data: reviews, isLoading } = useReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();

  const limparCampos = () => {
    setMovieId('');
    setRating('');
    setComment('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!movieId || !rating) {
      Alert.alert('Erro', 'Preencha o ID do filme e a nota');
      return;
    }

    const userStr = await AsyncStorage.getItem('@user');
    const user = JSON.parse(userStr);

    const data = {
      userId: Number(user.id),
      movieId: Number(movieId),
      rating: Number(rating),
      comments: comment,
    };

    try {
      if (editingId) {
        await updateReview.mutateAsync({
          id: editingId,
          review: { rating: Number(rating), comments: comment },
        });
        Alert.alert('Sucesso', 'Review atualizada!');
      } else {
        await createReview.mutateAsync(data);
        Alert.alert('Sucesso', 'Review criada!');
      }
      setMovieId('');
      setRating('');
      setComment('');
      setEditingId(null);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || JSON.stringify(error?.response?.data);
      Alert.alert('Erro', msg);
      console.log('ERRO COMPLETO:', JSON.stringify(error?.response?.data));
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setMovieId('');
    setRating(String(review.rating));
    setComment(review.comments || '');
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deletar esta review?', [
      { text: 'Cancelar' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () =>
          deleteReview(id, {
            onSuccess: () => Alert.alert('Sucesso', 'Review deletada!'),
            onError: (err) => Alert.alert('Erro', err.message),
          }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? '✏️ Editando Review' : '➕ Nova Review'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ID do Filme (ex: 1)"
        placeholderTextColor="#666"
        value={movieId}
        onChangeText={setMovieId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nota (1 a 5)"
        placeholderTextColor="#666"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Comentário"
        placeholderTextColor="#666"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity
        style={[styles.button, (createReview.isPending || updateReview.isPending) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={createReview.isPending || updateReview.isPending}
      >
        <Text style={styles.buttonText}>
          {createReview.isPending || updateReview.isPending
            ? 'Salvando...'
            : editingId ? 'Atualizar' : 'Criar Review'}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.cancelButton} onPress={limparCampos}>
          <Text style={styles.cancelText}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>📋 Reviews cadastradas</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#E50914" />
      ) : (
        <FlatList
          data={reviews || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>👤 {item.userName}</Text>
              <Text style={styles.cardText}>⭐ Nota: {String(item.rating)}</Text>
              <Text style={styles.cardText}>💬 {item.comments}</Text>
              <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteText}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma review encontrada.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  subtitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 25, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#16213e',
  },
  button: {
    backgroundColor: '#E50914',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 8, alignItems: 'center', padding: 10 },
  cancelText: { color: '#999' },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  cardText: { color: '#fff', marginBottom: 4 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { backgroundColor: '#0f3460', padding: 8, borderRadius: 6, flex: 1, marginRight: 5, alignItems: 'center' },
  editText: { color: '#fff' },
  deleteButton: { backgroundColor: '#E50914', padding: 8, borderRadius: 6, flex: 1, marginLeft: 5, alignItems: 'center' },
  deleteText: { color: '#fff' },
  empty: { color: '#666', textAlign: 'center', marginTop: 20 },
});