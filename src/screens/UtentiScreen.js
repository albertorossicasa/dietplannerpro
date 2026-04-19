import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity, Switch } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import * as Crypto from 'expo-crypto';

export default function UtentiScreen() {
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', ruolo: 'operatore' });

  useEffect(() => { loadUtenti(); }, []);

  const loadUtenti = async () => { const data = await Database.getUtenti(); setUtenti(data); setLoading(false); };

  const hashPassword = async (pwd) => await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pwd);

  const aggiungi = async () => {
    if (!form.username || !form.password) { Alert.alert('Errore', 'Inserisci username e password'); return; }
    const hash = await hashPassword(form.password);
    await Database.addUtente(form.username, hash, form.ruolo);
    setForm({ username: '', password: '', ruolo: 'operatore' });
    loadUtenti();
    Alert.alert('Successo', 'Utente aggiunto');
  };

  const toggleAttivo = async (id, current, ruolo) => { await Database.updateUtente(id, current ? 0 : 1, ruolo); loadUtenti(); };

  const elimina = (id, username) => {
    if (username === 'admin') { Alert.alert('Attenzione', 'Non puoi eliminare admin'); return; }
    Alert.alert('Conferma', `Eliminare ${username}?`, [{ text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteUtente(id); loadUtenti(); } }]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>➕ Nuovo Utente</Text>
        <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={v => setForm({ ...form, username: v })} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={v => setForm({ ...form, password: v })} secureTextEntry />
        <View style={styles.roleRow}>
          <TouchableOpacity style={[styles.roleBtn, form.ruolo === 'admin' && styles.roleActive]} onPress={() => setForm({ ...form, ruolo: 'admin' })}><Text>Admin</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, form.ruolo === 'operatore' && styles.roleActive]} onPress={() => setForm({ ...form, ruolo: 'operatore' })}><Text>Operatore</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, form.ruolo === 'lettore' && styles.roleActive]} onPress={() => setForm({ ...form, ruolo: 'lettore' })}><Text>Lettore</Text></TouchableOpacity>
        </View>
        <CustomButton title="➕ Aggiungi Utente" onPress={aggiungi} />
      </View>
      <Text style={styles.listTitle}>📋 Utenti esistenti</Text>
      <FlatList data={utenti} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.userCard}><View><Text style={styles.username}>{item.username}</Text><Text style={styles.role}>{item.ruolo}</Text><Text style={styles.lastAccess}>Ultimo accesso: {item.ultimo_accesso || 'Mai'}</Text></View><View style={styles.userActions}><Switch value={item.attivo === 1} onValueChange={() => toggleAttivo(item.id, item.attivo, item.ruolo)} trackColor={{ false: colors.grayLight, true: colors.primary }} /><TouchableOpacity onPress={() => elimina(item.id, item.username)}><Text style={styles.delete}>🗑️</Text></TouchableOpacity></View></View>)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 15 },
  formCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: colors.light, borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  roleRow: { flexDirection: 'row', marginBottom: 15 }, roleBtn: { flex: 1, padding: 10, backgroundColor: colors.grayLight, alignItems: 'center', marginHorizontal: 3, borderRadius: 8 },
  roleActive: { backgroundColor: colors.primary },
  listTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 }, userCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  username: { fontSize: 16, fontWeight: 'bold' }, role: { fontSize: 12, color: colors.gray }, lastAccess: { fontSize: 10, color: colors.grayLight, marginTop: 4 },
  userActions: { flexDirection: 'row', alignItems: 'center' }, delete: { fontSize: 20, marginLeft: 15 }
});