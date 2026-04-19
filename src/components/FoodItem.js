import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function FoodItem({ food }) {
  return (
    <View style={styles.container}>
      <View><Text style={styles.name}>{food.nome}</Text><Text style={styles.category}>{food.categoria}</Text></View>
      <View style={styles.nutrition}>
        <Text style={styles.kcal}>{food.kcal} kcal</Text>
        <Text style={styles.macro}>P:{food.proteine}g C:{food.carbo}g G:{food.grassi}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, padding: 12, marginHorizontal: 15, marginVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.grayLight },
  name: { fontSize: 16, fontWeight: '500' }, category: { fontSize: 12, color: colors.gray },
  nutrition: { alignItems: 'flex-end' }, kcal: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
  macro: { fontSize: 10, color: colors.gray }
});