import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

export default function AddDietScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!nome.trim()) { Alert.alert('Errore', 'Inserisci un nome per la dieta'); return; }
    setLoading(true);
    await Database.addDieta(clientId, nome, note);
    Alert.alert('Successo', 'Dieta creata!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome Dieta *</Text><TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Es: Dieta Dimagrante" />
        <Text style={styles.label}>Note / Indicazioni</Text><TextInput style={[styles.input, styles.textArea]} value={note} onChangeText={setNote} placeholder="Indicazioni nutrizionali..." multiline numberOfLines={5} />
        <CustomButton title={loading ? 'Creazione...' : '💾 CREA DIETA'} onPress={handleSubmit} loading={loading} />
        <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, form: { padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 120, textAlignVertical: 'top' }
});