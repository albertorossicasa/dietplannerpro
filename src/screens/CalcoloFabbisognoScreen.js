import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { calcolaFabbisogno } from '../utils/fabbisogno';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CalcoloFabbisognoScreen({ route }) {
  const { cliente } = route.params;
  const [attivita, setAttivita] = useState('moderato');
  const [obiettivo, setObiettivo] = useState('mantenimento');

  const fabbisogno = calcolaFabbisogno({ ...cliente, livelloAttivita: attivita, obiettivo });
  const livelli = ['sedentario', 'leggero', 'moderato', 'attivo', 'molto attivo'];
  const obiettivi = ['perdere peso', 'mantenimento', 'aumentare peso'];

  if (!fabbisogno) return <Text style={styles.error}>Dati insufficienti</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Calcolo Fabbisogno</Text>
      <Text style={styles.subtitle}>{cliente.nome} {cliente.cognome}</Text>
      <View style={styles.card}><Text style={styles.label}>Attività</Text><View style={styles.row}>{livelli.map(l => (<TouchableOpacity key={l} style={[styles.option, attivita === l && styles.optionActive]} onPress={() => setAttivita(l)}><Text>{l}</Text></TouchableOpacity>))}</View></View>
      <View style={styles.card}><Text style={styles.label}>Obiettivo</Text><View style={styles.row}>{obiettivi.map(o => (<TouchableOpacity key={o} style={[styles.option, obiettivo === o && styles.optionActive]} onPress={() => setObiettivo(o)}><Text>{o}</Text></TouchableOpacity>))}</View></View>
      <View style={styles.result}><Text style={styles.resultTitle}>Risultati</Text><View style={styles.resultRow}><Icon name="fire" size={24} color={colors.primary} /><Text style={styles.resultValue}>{fabbisogno.tdee} kcal</Text><Text>Dispendio totale</Text></View><View style={styles.resultRow}><Icon name="bed" size={24} /><Text style={styles.resultValue}>{fabbisogno.bmr} kcal</Text><Text>Metabolismo basale</Text></View><View style={styles.divider} /><Text style={styles.macroTitle}>Macronutrienti</Text><Text>Carboidrati: {fabbisogno.carbo}g</Text><Text>Proteine: {fabbisogno.proteine}g</Text><Text>Grassi: {fabbisogno.grassi}g</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 15 }, title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' }, subtitle: { textAlign: 'center', color: colors.gray, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15 }, label: { fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap' }, option: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.grayLight, margin: 4 },
  optionActive: { backgroundColor: colors.primary }, result: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 }, resultRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  resultValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginLeft: 10 }, divider: { height: 1, backgroundColor: '#ddd', width: '100%', marginVertical: 15 },
  macroTitle: { fontWeight: 'bold', marginBottom: 10 }, error: { textAlign: 'center', marginTop: 50, fontSize: 16, color: colors.danger }
});