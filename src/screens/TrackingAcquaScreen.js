import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Database } from '../database/Database';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

export default function TrackingAcquaScreen({ route }) {
  const { clientId } = route.params;
  const [records, setRecords] = useState([]);
  const [totale, setTotale] = useState(0);
  const [quantita, setQuantita] = useState('200');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { loadRecords(); }, [data]);

  const loadRecords = async () => {
    const rec = await Database.getTrackingAcqua(clientId, data);
    setRecords(rec);
    const tot = await Database.getTotaleAcquaGiornaliero(clientId, data);
    setTotale(tot);
  };

  const aggiungi = async () => {
    const q = parseInt(quantita);
    if (isNaN(q) || q <= 0) { Alert.alert('Errore', 'Quantità non valida'); return; }
    await Database.addTrackingAcqua(clientId, q, data);
    setQuantita('200');
    loadRecords();
  };

  const elimina = async (id) => { await Database.deleteTrackingAcqua(id); loadRecords(); };

  const chartData = { labels: records.slice(-7).map(r => r.orario?.substring(0, 5) || ''), datasets: [{ data: records.slice(-7).map(r => r.quantita_ml), color: () => colors.primary }] };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Acqua {data}</Text>
      <Text style={styles.total}>{totale} ml / 2000 ml</Text>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${Math.min(100, (totale / 2000) * 100)}%` }]} /></View>
      <View style={styles.inputRow}><TextInput style={styles.input} value={quantita} onChangeText={setQuantita} keyboardType="numeric" placeholder="ml" /><TouchableOpacity style={styles.addBtn} onPress={aggiungi}><Icon name="plus" size={24} color="#fff" /></TouchableOpacity></View>
      <FlatList data={records} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.record}><Text>{item.orario}</Text><Text>{item.quantita_ml} ml</Text><TouchableOpacity onPress={() => elimina(item.id)}><Icon name="delete" size={20} color={colors.danger} /></TouchableOpacity></View>)} />
      {records.length >= 2 && <LineChart data={chartData} width={350} height={180} chartConfig={{ backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 0, color: () => colors.primary }} bezier style={styles.chart} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 15 }, title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' }, total: { fontSize: 18, textAlign: 'center', marginVertical: 10 },
  progress: { height: 20, backgroundColor: '#ddd', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }, progressFill: { height: '100%', backgroundColor: colors.primary },
  inputRow: { flexDirection: 'row', marginBottom: 20 }, input: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, marginRight: 10, borderWidth: 1 },
  addBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 12, justifyContent: 'center', alignItems: 'center' },
  record: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  chart: { marginTop: 20, borderRadius: 16 }
});