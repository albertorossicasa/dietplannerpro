import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function MealCard({ meal }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.mealType}>{meal.pasto}</Text><Text style={styles.kcal}>{meal.kcal} kcal</Text></View>
      <Text style={styles.description}>{meal.descrizione}</Text>
      <View style={styles.macros}><Text style={styles.macro}>🥩 {meal.proteine}g</Text><Text style={styles.macro}>🍚 {meal.carbo}g</Text><Text style={styles.macro}>🧈 {meal.grassi}g</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: 10, padding: 12, marginHorizontal: 15, marginVertical: 5, borderLeftWidth: 4, borderLeftColor: colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mealType: { fontSize: 16, fontWeight: 'bold', color: colors.primary }, kcal: { fontSize: 14, color: colors.grayDark },
  description: { fontSize: 14, marginBottom: 8 }, macros: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  macro: { fontSize: 12, color: colors.gray }
});