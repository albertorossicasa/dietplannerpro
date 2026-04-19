import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors, DAYS, MEAL_TYPES } from '../utils/constants';

export default function AddMealScreen({ route, navigation }) {
  const { dietId } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ giorno: DAYS[0], pasto: MEAL_TYPES[0], descrizione: '', kcal: '', proteine: '', carbo: '', grassi: '' });

  const handleSubmit = async () => {
    if (!form.descrizione.trim()) { Alert.alert('Errore', 'Inserisci la descrizione'); return; }
    setLoading(true);
    await Database.addPasto({ dieta_id: dietId, ...form, kcal: parseFloat(form.kcal) || 0, proteine: parseFloat(form.proteine) || 0, carbo: parseFloat(form.carbo) || 0, grassi: parseFloat(form.grassi) || 0 });
    Alert.alert('Successo', 'Pasto aggiunto!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Giorno</Text><View style={styles.row}>{DAYS.map(day => (<TouchableOpacity key={day} style={[styles.option, form.giorno === day && styles.optionActive]} onPress={() => setForm({ ...form, giorno: day })}><Text>{day.substring(0, 3)}</Text></TouchableOpacity>))}</View>
        <Text style={styles.label}>Pasto</Text><View style={styles.row}>{MEAL_TYPES.map(meal => (<TouchableOpacity key={meal} style={[styles.option, form.pasto === meal && styles.optionActive]} onPress={() => setForm({ ...form, pasto: meal })}><Text>{meal}</Text></TouchableOpacity>))}</View>
        <Text style={styles.label}>Descrizione *</Text><TextInput style={[styles.input, styles.textArea]} value={form.descrizione} onChangeText={v => setForm({ ...form, descrizione: v })} placeholder="Es: Petto di pollo con verdure" multiline />
        <Text style={styles.label}>Kcal</Text><TextInput style={styles.input} value={form.kcal} onChangeText={v => setForm({ ...form, kcal: v })} keyboardType="numeric" />
        <Text style={styles.label}>Proteine (g)</Text><TextInput style={styles.input} value={form.proteine} onChangeText={v => setForm({ ...form, proteine: v })} keyboardType="numeric" />
        <Text style={styles.label}>Carboidrati (g)</Text><TextInput style={styles.input} value={form.carbo} onChangeText={v => setForm({ ...form, carbo: v })} keyboardType="numeric" />
        <Text style={styles.label}>Grassi (g)</Text><TextInput style={styles.input} value={form.grassi} onChangeText={v => setForm({ ...form, grassi: v })} keyboardType="numeric" />
        <CustomButton title={loading ? 'Salvataggio...' : '💾 SALVA PASTO'} onPress={handleSubmit} loading={loading} />
        <CustomButton title="❌ ANNULLA" variant="danger" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, form: { padding: 20 }, label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' }, textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }, option: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.grayLight, margin: 4 },
  optionActive: { backgroundColor: colors.primary }
});