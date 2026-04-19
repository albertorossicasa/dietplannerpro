import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: '', cognome: '', telefono: '', email: '', specializzazione: '' });

  useEffect(() => { loadProf(); }, []);

  const loadProf = async () => { 
    const p = await Database.getProfessionista(); 
    if (p) setForm(p); 
    setLoading(false); 
  };

  const saveProf = async () => {
    setSaving(true);
    await Database.saveProfessionista(form);
    Alert.alert('Successo', 'Dati salvati');
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Il mio Profilo</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={form.nome} onChangeText={v => setForm({ ...form, nome: v })} />
        
        <Text style={styles.label}>Cognome</Text>
        <TextInput style={styles.input} value={form.cognome} onChangeText={v => setForm({ ...form, cognome: v })} />
        
        <Text style={styles.label}>Telefono</Text>
        <TextInput style={styles.input} value={form.telefono} onChangeText={v => setForm({ ...form, telefono: v })} keyboardType="phone-pad" />
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={v => setForm({ ...form, email: v })} autoCapitalize="none" />
        
        <Text style={styles.label}>Specializzazione</Text>
        <TextInput style={styles.input} value={form.specializzazione} onChangeText={v => setForm({ ...form, specializzazione: v })} />
        
        <CustomButton title={saving ? 'Salvataggio...' : '💾 SALVA'} onPress={saveProf} loading={saving} />
        <CustomButton title="🚪 ESCE" variant="danger" onPress={logout} />
      </View>
      <Text style={styles.version}>DietPlannerPro v1.0 - App completa</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  header: { backgroundColor: colors.primary, padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10, color: colors.dark },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  version: { textAlign: 'center', color: colors.gray, marginTop: 20, marginBottom: 30 }
});