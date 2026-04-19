import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

export default function AddMonitoringScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [peso, setPeso] = useState('');
  const [note, setNote] = useState('');

  const formatDate = (d) => d.toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!peso || isNaN(parseFloat(peso))) { Alert.alert('Errore', 'Inserisci un peso valido'); return; }
    setLoading(true);
    await Database.addMonitoraggio({ cliente_id: clientId, data: formatDate(date), peso: parseFloat(peso), note });
    Alert.alert('Successo', 'Rilevazione aggiunta!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Data</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDate(true)}><Text style={styles.dateText}>{formatDate(date)}</Text></TouchableOpacity>
      {showDate && <DateTimePicker value={date} mode="date" display="default" onChange={(event, selected) => { setShowDate(false); if (selected) setDate(selected); }} />}
      <Text style={styles.label}>Peso (kg) *</Text><TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="numeric" placeholder="70.5" />
      <Text style={styles.label}>Note</Text><TextInput style={[styles.input, styles.textArea]} value={note} onChangeText={setNote} multiline placeholder="Note..." />
      <CustomButton title={loading ? 'Salvataggio...' : '💾 SALVA RILEVAZIONE'} onPress={handleSubmit} loading={loading} />
      <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 80, textAlignVertical: 'top' },
  dateBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' }, dateText: { fontSize: 16 }
});