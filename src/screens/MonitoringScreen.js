import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import { formatDate, formatWeight } from '../utils/helpers';
import { LineChart } from 'react-native-chart-kit';

export default function MonitoringScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => { const d = await Database.getMonitoraggio(clientId); setData(d); setLoading(false); };
  useFocusEffect(useCallback(() => { loadData(); }, []));
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const handleDelete = (id) => { Alert.alert('Elimina', 'Rimuovere questa rilevazione?', [{ text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteMonitoraggio(id); loadData(); } }]); };

  const chartData = { labels: data.slice(-7).map(d => d.data.substring(0, 5)), datasets: [{ data: data.slice(-7).map(d => d.peso), color: () => colors.primary }] };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {data.length >= 2 && (<LineChart data={chartData} width={350} height={180} chartConfig={{ backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 1, color: () => colors.primary }} bezier style={styles.chart} />)}
      <FlatList data={data} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.card}><Text style={styles.date}>{formatDate(item.data)}</Text><Text style={styles.weight}>{formatWeight(item.peso)}</Text><TouchableOpacity onPress={() => handleDelete(item.id)}><Icon name="delete" size={20} color={colors.danger} /></TouchableOpacity></View>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<View style={styles.empty}><Icon name="scale" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessuna rilevazione</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMonitoring', { clientId })}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, chart: { margin: 10, borderRadius: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12, elevation: 3 },
  date: { fontSize: 14, fontWeight: 'bold', color: colors.primary }, weight: { fontSize: 18, fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});