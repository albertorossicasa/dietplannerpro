import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors, CATEGORIES } from '../utils/constants';

export default function AddFoodScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: '', kcal: '', proteine: '', carbo: '', grassi: '', categoria: 'Altro' });

  const handleSubmit = async () => {
    if (!form.nome.trim()) { Alert.alert('Errore', 'Inserisci il nome'); return; }
    if (!form.kcal || isNaN(parseFloat(form.kcal))) { Alert.alert('Errore', 'Inserisci kcal valide'); return; }
    setLoading(true);
    await Database.addAlimento({ ...form, kcal: parseFloat(form.kcal), proteine: parseFloat(form.proteine) || 0, carbo: parseFloat(form.carbo) || 0, grassi: parseFloat(form.grassi) || 0 });
    Alert.alert('Successo', 'Alimento aggiunto!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome *</Text><TextInput style={styles.input} value={form.nome} onChangeText={v => setForm({ ...form, nome: v })} />
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.catRow}>{CATEGORIES.map(cat => (<TouchableOpacity key={cat} style={[styles.catBtn, form.categoria === cat && styles.catBtnActive]} onPress={() => setForm({ ...form, categoria: cat })}><Text style={form.categoria === cat && styles.catBtnTextActive}>{cat}</Text></TouchableOpacity>))}</View>
        <Text style={styles.label}>Kcal (per 100g) *</Text><TextInput style={styles.input} value={form.kcal} onChangeText={v => setForm({ ...form, kcal: v })} keyboardType="numeric" />
        <Text style={styles.label}>Proteine (g)</Text><TextInput style={styles.input} value={form.proteine} onChangeText={v => setForm({ ...form, proteine: v })} keyboardType="numeric" />
        <Text style={styles.label}>Carboidrati (g)</Text><TextInput style={styles.input} value={form.carbo} onChangeText={v => setForm({ ...form, carbo: v })} keyboardType="numeric" />
        <Text style={styles.label}>Grassi (g)</Text><TextInput style={styles.input} value={form.grassi} onChangeText={v => setForm({ ...form, grassi: v })} keyboardType="numeric" />
        <CustomButton title={loading ? 'Salvataggio...' : '💾 SALVA ALIMENTO'} onPress={handleSubmit} loading={loading} />
        <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, form: { padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }, catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: colors.grayLight, margin: 4 },
  catBtnActive: { backgroundColor: colors.primary }, catBtnTextActive: { color: '#fff', fontWeight: 'bold' }
});