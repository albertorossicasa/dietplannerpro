import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import { formatDate, formatCurrency } from '../utils/helpers';

export default function InvoicesScreen({ route, navigation }) {
  const { clientId } = route.params || {};
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInvoices = async () => { const data = await Database.getFatture(clientId); setInvoices(data); setLoading(false); };
  useFocusEffect(useCallback(() => { loadInvoices(); }, []));
  const onRefresh = async () => { setRefreshing(true); await loadInvoices(); setRefreshing(false); };

  const togglePagato = async (id, current) => { await Database.updateFatturaPagato(id, current ? 0 : 1); loadInvoices(); };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList data={invoices} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.card}><View style={styles.cardHeader}><Text style={styles.number}>{item.numero}</Text><TouchableOpacity onPress={() => togglePagato(item.id, item.pagato)}><View style={[styles.status, item.pagato ? styles.paid : styles.unpaid]}><Text style={styles.statusText}>{item.pagato ? 'Pagato' : 'In attesa'}</Text></View></TouchableOpacity></View><Text style={styles.date}>{formatDate(item.data)}</Text><Text style={styles.desc}>{item.descrizione}</Text><Text style={styles.amount}>{formatCurrency(item.importo)}</Text></View>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<View style={styles.empty}><Icon name="file-document" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessuna fattura</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddInvoice', { clientId })}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, number: { fontSize: 16, fontWeight: 'bold' },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }, paid: { backgroundColor: colors.success }, unpaid: { backgroundColor: colors.warning },
  statusText: { color: '#fff', fontSize: 12 }, date: { fontSize: 12, color: colors.gray, marginBottom: 8 }, desc: { fontSize: 14, marginBottom: 8 },
  amount: { fontSize: 18, fontWeight: 'bold', color: colors.primary, textAlign: 'right' },
  empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});