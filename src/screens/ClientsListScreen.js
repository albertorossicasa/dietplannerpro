import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import ClientCard from '../components/ClientCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';

export default function ClientsListScreen({ navigation }) {
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadClients = async () => {
    const data = await Database.getClienti();
    setClients(data);
    setFiltered(data);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { loadClients(); }, []));

  useEffect(() => {
    if (search) {
      const f = clients.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cognome.toLowerCase().includes(search.toLowerCase()) || c.codice_fiscale?.toLowerCase().includes(search.toLowerCase()));
      setFiltered(f);
    } else setFiltered(clients);
  }, [search, clients]);

  const onRefresh = async () => { setRefreshing(true); await loadClients(); setRefreshing(false); };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Cerca nome, cognome o CF" />
      <FlatList data={filtered} keyExtractor={item => item.id.toString()} renderItem={({ item }) => <ClientCard client={item} onPress={() => navigation.navigate('ClientDetail', { clientId: item.id, client: item })} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={styles.empty}><Icon name="account-group" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessun cliente</Text><TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddClient')}><Text style={styles.addBtnText}>➕ Aggiungi</Text></TouchableOpacity></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddClient')}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  addBtn: { marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 }, addBtnText: { color: '#fff', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});