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
  useLists,
  useCreateList,
  useUpdateList,
  useDeleteList,
  useAddMovieToList,
  useRemoveMovieFromList,
} from '../../hooks/useLists';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import MoviePicker from '../../components/MoviePicker';

export default function ListsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { data: lists, isLoading, error } = useLists();
  const createList = useCreateList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const addMovie = useAddMovieToList();
  const removeMovie = useRemoveMovieFromList();

  const resetForm = () => {
    setName('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para a lista.');
      return;
    }
    if (!user?.id) {
      Alert.alert('Login necessário', 'Entre na sua conta.');
      return;
    }

    try {
      if (editingId) {
        await updateList.mutateAsync({ id: editingId, data: { name } });
      } else {
        await createList.mutateAsync({ name, userId: user.id });
      }
      resetForm();
    } catch (err) {
      Alert.alert('Erro', err?.message || 'Não foi possível salvar');
    }
  };

  const handleDelete = (id, listName) => {
    Alert.alert('Excluir lista?', listName, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteList.mutate(id),
      },
    ]);
  };

  const handleAddMovie = (listId) => {
    if (!selectedMovieId) {
      Alert.alert('Atenção', 'Selecione um filme.');
      return;
    }
    addMovie.mutate(
      { listId, movieId: Number(selectedMovieId) },
      {
        onSuccess: () => {
          setSelectedMovieId(null);
          setExpandedId(listId);
        },
        onError: (err) => Alert.alert('Erro', err.message),
      }
    );
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar listas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showForm ? (
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.addBtnText}>+ Nova playlist</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="Nome da playlist"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveBtnText}>{editingId ? 'Salvar' : 'Criar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={lists}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedId(expanded ? null : item.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>
                    {item.movies?.length || 0} filme(s)
                  </Text>
                </View>
                <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.expanded}>
                  {item.movies?.map((m) => (
                    <View key={m.id} style={styles.movieRow}>
                      <Text style={styles.movieItem}>{m.title}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          removeMovie.mutate({ listId: item.id, movieId: m.id })
                        }
                      >
                        <Text style={styles.removeMovie}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <MoviePicker selectedId={selectedMovieId} onSelect={setSelectedMovieId} />
                  <TouchableOpacity
                    style={styles.addMovieBtn}
                    onPress={() => handleAddMovie(item.id)}
                  >
                    <Text style={styles.addMovieText}>Adicionar filme</Text>
                  </TouchableOpacity>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setName(item.name);
                        setEditingId(item.id);
                        setShowForm(true);
                      }}
                    >
                      <Text style={styles.link}>Renomear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
                      <Text style={styles.linkDanger}>Excluir lista</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Crie sua primeira playlist.</Text>
        }
      />
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
  addBtn: {
    margin: 16,
    backgroundColor: c.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  formBox: { margin: 16, padding: 16, backgroundColor: c.surface, borderRadius: 12, borderWidth: 1, borderColor: c.border },
  input: {
    backgroundColor: c.background,
    color: c.text,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  formActions: { flexDirection: 'row', marginTop: 12 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: c.surfaceAlt,
    borderRadius: 8,
    marginRight: 6,
  },
  cancelBtnText: { color: c.textSecondary },
  saveBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: c.primary,
    borderRadius: 8,
    marginLeft: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: c.card,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  cardTitle: { color: c.text, fontSize: 17, fontWeight: 'bold' },
  cardSub: { color: c.textMuted, fontSize: 13, marginTop: 2 },
  chevron: { color: c.textMuted, fontSize: 14, paddingLeft: 8 },
  expanded: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: c.border },
  movieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  movieItem: { color: c.textSecondary, flex: 1 },
  removeMovie: { color: c.error, fontSize: 13 },
  addMovieBtn: {
    backgroundColor: c.primaryMuted,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addMovieText: { color: '#fff', fontWeight: '600' },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  link: { color: c.link },
  linkDanger: { color: c.error },
  empty: { color: c.textMuted, textAlign: 'center', marginTop: 40 },
  error: { color: c.error },
});
