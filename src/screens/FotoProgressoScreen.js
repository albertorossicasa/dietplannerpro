import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import { formatDate } from '../utils/helpers';
import * as FileSystem from 'expo-file-system';

export default function FotoProgressoScreen({ route }) {
  const { clientId } = route.params;
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFotos = async () => { const data = await Database.getFotoProgresso(clientId); setFotos(data); setLoading(false); };
  useFocusEffect(useCallback(() => { loadFotos(); }, []));
  const onRefresh = async () => { setRefreshing(true); await loadFotos(); setRefreshing(false); };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permesso negato'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = `foto_${clientId}_${Date.now()}.jpg`;
      const destPath = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: uri, to: destPath });
      await Database.addFotoProgresso(clientId, destPath, new Date().toISOString().split('T')[0], '');
      loadFotos();
    }
  };

  const handleDelete = (id) => { Alert.alert('Elimina', 'Rimuovere questa foto?', [{ text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteFotoProgresso(id); loadFotos(); } }]); };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList data={fotos} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.card}><Image source={{ uri: item.percorso_immagine }} style={styles.image} /><Text style={styles.date}>{formatDate(item.data)}</Text><TouchableOpacity onPress={() => handleDelete(item.id)}><Icon name="delete" size={24} color={colors.danger} /></TouchableOpacity></View>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<View style={styles.empty}><Icon name="camera" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessuna foto</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={pickImage}><Icon name="camera" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, card: { backgroundColor: '#fff', margin: 10, padding: 10, borderRadius: 12, alignItems: 'center' },
  image: { width: 200, height: 200, borderRadius: 10 }, date: { fontSize: 12, color: colors.gray, marginTop: 5 },
  empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});