import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLists, useCreateList, useUpdateList, useDeleteList } from '../../hooks/useLists';

export default function ListsScreen() {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { data: lists, isLoading, error } = useLists();
  const createList = useCreateList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();

  const getUserId = async () => {
    const userStr = await AsyncStorage.getItem('@user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Preencha o nome da lista');
      return;
    }

    try {
      if (editingId) {
        await updateList.mutateAsync({ id: editingId, data: { name } });
        Alert.alert('Sucesso', 'Lista atualizada!');
        setEditingId(null);
      } else {
        const userId = await getUserId();
        if (!userId) {
          Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
          return;
        }
        await createList.mutateAsync({ name, userId });
        Alert.alert('Sucesso', 'Lista criada!');
      }
      setName('');
    } catch (err) {
      console.log('ERRO COMPLETO:', err?.message);
      Alert.alert('Erro', err?.message || 'Erro ao salvar lista');
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja excluir esta lista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteList.mutateAsync(id);
            Alert.alert('Sucesso', 'Lista excluída!');
          } catch (err) {
            Alert.alert('Erro', err?.message || 'Erro ao excluir');
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    setName('');
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar listas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? '✏️ Editar Lista' : '+ Nova Lista'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da lista"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editingId ? 'Salvar Alterações' : 'Criar Lista'}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={lists}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 {item.name}</Text>
            <Text style={styles.cardSub}>👤 {item.userName}</Text>
            <Text style={styles.cardSub}>
              🎬 {item.movies?.length || 0} filme(s)
            </Text>

            {item.movies?.length > 0 && (
              <View style={styles.movieList}>
                {item.movies.map((m) => (
                  <Text key={m.id} style={styles.movieItem}>
                    • {m.title}
                  </Text>
                ))}
              </View>
            )}

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
          <Text style={styles.empty}>Nenhuma lista encontrada</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#0f3460',
  },
  button: {
    backgroundColor: '#E50914', padding: 14, borderRadius: 8,
    alignItems: 'center', marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: {
    backgroundColor: '#333', padding: 12, borderRadius: 8,
    alignItems: 'center', marginBottom: 20,
  },
  cancelText: { color: '#ccc', fontWeight: 'bold' },
  card: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#0f3460',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#ccc', marginBottom: 2 },
  movieList: { marginTop: 8, marginBottom: 4, paddingLeft: 8 },
  movieItem: { color: '#aaa', fontSize: 13, marginBottom: 2 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: {
    backgroundColor: '#0f3460', padding: 8, borderRadius: 6,
    flex: 1, marginRight: 5, alignItems: 'center',
  },
  editText: { color: '#fff' },
  deleteButton: {
    backgroundColor: '#E50914', padding: 8, borderRadius: 6,
    flex: 1, marginLeft: 5, alignItems: 'center',
  },
  deleteText: { color: '#fff' },
  empty: { color: '#666', textAlign: 'center', marginTop: 20 },
  error: { color: '#E50914', fontSize: 16 },
});
