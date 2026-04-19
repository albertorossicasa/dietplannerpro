import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

export default function AddAppuntamentoScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [form, setForm] = useState({ titolo: '', descrizione: '' });

  const formatDate = (d) => d.toISOString().split('T')[0];
  const formatTime = (d) => d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  const handleSubmit = async () => {
    if (!form.titolo.trim()) { Alert.alert('Errore', 'Inserisci un titolo'); return; }
    setLoading(true);
    await Database.addAppuntamento({ cliente_id: clientId, titolo: form.titolo, data: formatDate(date), ora: formatTime(time), descrizione: form.descrizione });
    Alert.alert('Successo', 'Appuntamento aggiunto!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titolo *</Text><TextInput style={styles.input} value={form.titolo} onChangeText={v => setForm({ ...form, titolo: v })} />
      <Text style={styles.label}>Data</Text><TouchableOpacity style={styles.dateBtn} onPress={() => setShowDate(true)}><Text>{formatDate(date)}</Text></TouchableOpacity>
      {showDate && <DateTimePicker value={date} mode="date" display="default" onChange={(event, selected) => { setShowDate(false); if (selected) setDate(selected); }} />}
      <Text style={styles.label}>Ora</Text><TouchableOpacity style={styles.dateBtn} onPress={() => setShowTime(true)}><Text>{formatTime(time)}</Text></TouchableOpacity>
      {showTime && <DateTimePicker value={time} mode="time" display="default" onChange={(event, selected) => { setShowTime(false); if (selected) setTime(selected); }} />}
      <Text style={styles.label}>Descrizione</Text><TextInput style={[styles.input, styles.textArea]} value={form.descrizione} onChangeText={v => setForm({ ...form, descrizione: v })} multiline />
      <CustomButton title={loading ? 'Salvataggio...' : '💾 SALVA'} onPress={handleSubmit} loading={loading} />
      <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 80, textAlignVertical: 'top' },
  dateBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' }
});