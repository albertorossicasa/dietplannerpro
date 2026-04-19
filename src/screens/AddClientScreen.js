import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, Modal } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { calcolaCodiceFiscale, validazioneCF } from '../utils/codiceFiscale';
import { colors } from '../utils/colors';

export default function AddClientScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: '', cognome: '', codice_fiscale: '', data_nascita: '', sesso: 'M', telefono: '', email: '', indirizzo: '', citta: '', altezza_cm: '', peso_kg: '', patologia: '', note: '' });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const calcolaCF = () => {
    if (!form.nome || !form.cognome || !form.data_nascita || !form.citta) { Alert.alert('Errore', 'Inserisci nome, cognome, data nascita e città'); return; }
    const cf = calcolaCodiceFiscale(form.nome, form.cognome, form.sesso, form.data_nascita, form.citta);
    setForm({ ...form, codice_fiscale: cf });
  };

  const validateForm = () => {
    if (!form.nome.trim()) { Alert.alert('Errore', 'Inserisci il nome'); return false; }
    if (!form.cognome.trim()) { Alert.alert('Errore', 'Inserisci il cognome'); return false; }
    if (form.codice_fiscale && !validazioneCF(form.codice_fiscale)) { Alert.alert('Errore', 'Codice fiscale non valido'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await Database.addCliente({ ...form, altezza_cm: parseInt(form.altezza_cm) || 0, peso_kg: parseFloat(form.peso_kg) || 0 });
    Alert.alert('Successo', 'Cliente aggiunto!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome *</Text><TextInput style={styles.input} value={form.nome} onChangeText={v => handleChange('nome', v)} />
        <Text style={styles.label}>Cognome *</Text><TextInput style={styles.input} value={form.cognome} onChangeText={v => handleChange('cognome', v)} />
        <Text style={styles.label}>Codice Fiscale</Text>
        <View style={styles.cfRow}>
          <TextInput style={[styles.input, styles.cfInput]} value={form.codice_fiscale} onChangeText={v => handleChange('codice_fiscale', v.toUpperCase())} />
          <TouchableOpacity style={styles.cfButton} onPress={calcolaCF}><Text style={styles.cfButtonText}>🧮 Calcola</Text></TouchableOpacity>
        </View>
        <Text style={styles.label}>Data Nascita (GG/MM/AAAA)</Text><TextInput style={styles.input} value={form.data_nascita} onChangeText={v => handleChange('data_nascita', v)} placeholder="15/03/1980" />
        <Text style={styles.label}>Sesso</Text>
        <View style={styles.sexRow}>
          <TouchableOpacity style={[styles.sexButton, form.sesso === 'M' && styles.sexButtonActive]} onPress={() => handleChange('sesso', 'M')}><Text style={form.sesso === 'M' && styles.sexButtonTextActive}>Maschio</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.sexButton, form.sesso === 'F' && styles.sexButtonActive]} onPress={() => handleChange('sesso', 'F')}><Text style={form.sesso === 'F' && styles.sexButtonTextActive}>Femmina</Text></TouchableOpacity>
        </View>
        <Text style={styles.label}>Città</Text><TextInput style={styles.input} value={form.citta} onChangeText={v => handleChange('citta', v)} />
        <Text style={styles.label}>Telefono</Text><TextInput style={styles.input} value={form.telefono} onChangeText={v => handleChange('telefono', v)} keyboardType="phone-pad" />
        <Text style={styles.label}>Email</Text><TextInput style={styles.input} value={form.email} onChangeText={v => handleChange('email', v)} autoCapitalize="none" />
        <Text style={styles.label}>Indirizzo</Text><TextInput style={styles.input} value={form.indirizzo} onChangeText={v => handleChange('indirizzo', v)} />
        <Text style={styles.label}>Altezza (cm)</Text><TextInput style={styles.input} value={form.altezza_cm} onChangeText={v => handleChange('altezza_cm', v)} keyboardType="numeric" />
        <Text style={styles.label}>Peso (kg)</Text><TextInput style={styles.input} value={form.peso_kg} onChangeText={v => handleChange('peso_kg', v)} keyboardType="numeric" />
        <Text style={styles.label}>Patologie</Text><TextInput style={[styles.input, styles.textArea]} value={form.patologia} onChangeText={v => handleChange('patologia', v)} multiline />
        <Text style={styles.label}>Note</Text><TextInput style={[styles.input, styles.textArea]} value={form.note} onChangeText={v => handleChange('note', v)} multiline />
        <CustomButton title={loading ? 'Salvataggio...' : '💾 SALVA CLIENTE'} onPress={handleSubmit} loading={loading} />
        <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, form: { padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 80, textAlignVertical: 'top' },
  cfRow: { flexDirection: 'row', alignItems: 'center' }, cfInput: { flex: 2, marginRight: 8 }, cfButton: { backgroundColor: colors.info, padding: 12, borderRadius: 8 }, cfButtonText: { color: '#fff', fontWeight: 'bold' },
  sexRow: { flexDirection: 'row', marginBottom: 10 }, sexButton: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#ddd', alignItems: 'center', marginHorizontal: 5 },
  sexButtonActive: { backgroundColor: colors.primary }, sexButtonTextActive: { color: '#fff', fontWeight: 'bold' }
});