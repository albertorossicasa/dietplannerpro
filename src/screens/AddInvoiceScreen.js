import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

export default function AddInvoiceScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [form, setForm] = useState({ numero: `F${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`, descrizione: '', importo: '' });

  const formatDate = (d) => d.toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!form.descrizione.trim()) { Alert.alert('Errore', 'Inserisci la descrizione'); return; }
    if (!form.importo || isNaN(parseFloat(form.importo))) { Alert.alert('Errore', 'Inserisci un importo valido'); return; }
    setLoading(true);
    await Database.addFattura({ numero: form.numero, cliente_id: clientId, data: formatDate(date), descrizione: form.descrizione, importo: parseFloat(form.importo) });
    Alert.alert('Successo', 'Fattura creata!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Numero Fattura</Text><TextInput style={styles.input} value={form.numero} onChangeText={v => setForm({ ...form, numero: v })} />
      <Text style={styles.label}>Data</Text><TouchableOpacity style={styles.dateBtn} onPress={() => setShowDate(true)}><Text style={styles.dateText}>{formatDate(date)}</Text></TouchableOpacity>
      {showDate && <DateTimePicker value={date} mode="date" display="default" onChange={(event, selected) => { setShowDate(false); if (selected) setDate(selected); }} />}
      <Text style={styles.label}>Descrizione *</Text><TextInput style={[styles.input, styles.textArea]} value={form.descrizione} onChangeText={v => setForm({ ...form, descrizione: v })} placeholder="Es: Consulenza nutrizionale" multiline />
      <Text style={styles.label}>Importo (€) *</Text><TextInput style={styles.input} value={form.importo} onChangeText={v => setForm({ ...form, importo: v })} keyboardType="numeric" placeholder="99.00" />
      <CustomButton title={loading ? 'Creazione...' : '💾 CREA FATTURA'} onPress={handleSubmit} loading={loading} />
      <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 80, textAlignVertical: 'top' },
  dateBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' }, dateText: { fontSize: 16 }
});