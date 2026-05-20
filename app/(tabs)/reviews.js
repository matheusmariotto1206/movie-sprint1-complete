import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from '../../hooks/useReviews';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import MoviePicker from '../../components/MoviePicker';
import StarRating from '../../components/StarRating';
import { useMovies } from '../../hooks/useMovies';
import { getMovieTitle } from '../../utils/movie';

export default function ReviewsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [movieId, setMovieId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { data: movies } = useMovies();
  const { data: reviews, isLoading } = useReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const resetForm = () => {
    setMovieId(null);
    setRating(0);
    setComment('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Login necessário', 'Entre na sua conta para avaliar filmes.');
      return;
    }
    if (!movieId || !rating) {
      Alert.alert('Atenção', 'Escolha o filme e a nota.');
      return;
    }

    try {
      if (editingId) {
        await updateReview.mutateAsync({
          id: editingId,
          review: { rating, comments: comment },
        });
      } else {
        const selected = movies?.find((m) => m.id === movieId);
        await createReview.mutateAsync({
          userId: Number(user.id),
          movieId: Number(movieId),
          rating,
          comments: comment,
          movieTitle: getMovieTitle(selected) || `Filme #${movieId}`,
        });
      }
      resetForm();
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Não foi possível salvar');
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setMovieId(review.movieId);
    setRating(Number(review.rating));
    setComment(review.comments || '');
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Excluir avaliação?', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteReview.mutate(id),
      },
    ]);
  };

  const renderForm = () => (
    <View style={styles.formBox}>
      {!editingId && (
        <MoviePicker selectedId={movieId} onSelect={setMovieId} />
      )}
      <Text style={styles.label}>Sua nota</Text>
      <StarRating value={rating} onChange={setRating} />
      <TextInput
        style={styles.input}
        placeholder="Comentário (opcional)"
        placeholderTextColor={colors.textMuted}
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSubmit}
          disabled={createReview.isPending || updateReview.isPending}
        >
          <Text style={styles.saveBtnText}>
            {createReview.isPending || updateReview.isPending ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showForm ? (
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.addBtnText}>+ Nova avaliação</Text>
        </TouchableOpacity>
      ) : (
        renderForm()
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={reviews || []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.movieTitle}>{item.movieTitle || `Filme #${item.movieId}`}</Text>
              <Text style={styles.meta}>
                {'★'.repeat(Math.round(Number(item.rating)))} {Number(item.rating)}/5
              </Text>
              {item.comments ? (
                <Text style={styles.comment} numberOfLines={2}>{item.comments}</Text>
              ) : null}
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={styles.link}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.linkDanger}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma avaliação ainda.</Text>
          }
        />
      )}
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  addBtn: {
    margin: 16,
    backgroundColor: c.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  formBox: {
    margin: 16,
    padding: 16,
    backgroundColor: c.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  label: { color: c.textSecondary, fontSize: 13, marginBottom: 4, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    padding: 12,
    color: c.text,
    backgroundColor: c.background,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  formActions: { flexDirection: 'row', marginTop: 12 },
  cancelBtn: {
    flex: 1,
    marginRight: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: c.surfaceAlt,
  },
  cancelBtnText: { color: c.textSecondary },
  saveBtn: {
    flex: 1,
    marginLeft: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: c.primary,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: c.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.border,
  },
  movieTitle: { color: c.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  meta: { color: c.accent, fontSize: 14, marginBottom: 6 },
  comment: { color: c.textSecondary, fontSize: 14, lineHeight: 20 },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  link: { color: c.link, fontSize: 14, marginLeft: 16 },
  linkDanger: { color: c.error, fontSize: 14, marginLeft: 16 },
  empty: { color: c.textMuted, textAlign: 'center', marginTop: 40 },
});
