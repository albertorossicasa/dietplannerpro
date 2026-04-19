import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import { formatDate, formatDateTime } from '../utils/helpers';

export default function AppuntamentiScreen({ route, navigation }) {
  const { clientId } = route.params || {};
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => { const data = await Database.getAppuntamenti(clientId); setAppuntamenti(data); setLoading(false); };
  useFocusEffect(useCallback(() => { loadData(); }, []));
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const toggleCompletato = async (id, current) => { await Database.updateAppuntamentoCompletato(id, current ? 0 : 1); loadData(); };
  const handleDelete = (id) => { Alert.alert('Elimina', 'Rimuovere questo appuntamento?', [{ text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteAppuntamento(id); loadData(); } }]); };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList data={appuntamenti} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.card}><View style={styles.cardHeader}><TouchableOpacity onPress={() => toggleCompletato(item.id, item.completato)}><View style={[styles.status, item.completato ? styles.completed : styles.pending]}><Text style={styles.statusText}>{item.completato ? '✅' : '⏳'}</Text></View></TouchableOpacity><Text style={styles.title}>{item.titolo}</Text><TouchableOpacity onPress={() => handleDelete(item.id)}><Icon name="delete" size={20} color={colors.danger} /></TouchableOpacity></View><Text style={styles.date}>{formatDateTime(item.data, item.ora)}</Text><Text style={styles.desc}>{item.descrizione}</Text></View>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<View style={styles.empty}><Icon name="calendar" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessun appuntamento</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddAppuntamento', { clientId })}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, status: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  completed: { backgroundColor: colors.success }, pending: { backgroundColor: colors.warning }, statusText: { color: '#fff' }, title: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 12, color: colors.gray, marginBottom: 8 }, desc: { fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});