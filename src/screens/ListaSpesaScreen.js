import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Database } from '../database/Database';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ListaSpesaScreen({ route }) {
  const { dietId } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { generateList(); }, []);

  const generateList = async () => {
    const pasti = await Database.getPastiByDieta(dietId);
    const ingredienti = {};
    pasti.forEach(p => {
      const parole = p.descrizione.toLowerCase().split(/[\s,]+/);
      parole.forEach(parola => { if (parola.length > 3 && !['con', 'e', 'di', 'il', 'la', 'gli', 'le', 'un', 'una'].includes(parola)) ingredienti[parola] = (ingredienti[parola] || 0) + 1; });
    });
    setItems(Object.entries(ingredienti).map(([nome, qta]) => ({ nome, quantita: qta, spuntato: false })));
    setLoading(false);
  };

  const toggle = (idx) => { const newItems = [...items]; newItems[idx].spuntato = !newItems[idx].spuntato; setItems(newItems); };

  if (loading) return <Text style={styles.loading}>Generazione...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Lista della Spesa</Text>
      <FlatList data={items} keyExtractor={(_, i) => i.toString()} renderItem={({ item, index }) => (<TouchableOpacity style={[styles.item, item.spuntato && styles.itemDone]} onPress={() => toggle(index)}><Icon name={item.spuntato ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={colors.primary} /><Text style={[styles.itemText, item.spuntato && styles.itemTextDone]}>{item.nome}</Text><Text style={styles.qta}>x{item.quantita}</Text></TouchableOpacity>)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 15 }, loading: { textAlign: 'center', marginTop: 50 }, title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 }, itemDone: { backgroundColor: '#e8f5e9' },
  itemText: { flex: 1, fontSize: 16, marginLeft: 12 }, itemTextDone: { textDecorationLine: 'line-through', color: colors.gray }, qta: { fontSize: 14, color: colors.gray }
});