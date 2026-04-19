import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import MealCard from '../components/MealCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomButton from '../components/CustomButton';
import { colors, DAYS, MEAL_TYPES } from '../utils/constants';

export default function DietScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDiets = async () => {
    const data = await Database.getDieteByCliente(clientId);
    setDiets(data);
    if (data.length > 0 && !selectedDiet) { setSelectedDiet(data[0]); await loadMeals(data[0].id); }
    else if (data.length === 0) setLoading(false);
  };

  const loadMeals = async (dietId) => { const data = await Database.getPastiByDieta(dietId); setMeals(data); setLoading(false); };

  useFocusEffect(useCallback(() => { loadDiets(); }, []));

  const onRefresh = async () => { setRefreshing(true); await loadDiets(); if (selectedDiet) await loadMeals(selectedDiet.id); setRefreshing(false); };

  const handleDietChange = async (diet) => { setSelectedDiet(diet); await loadMeals(diet.id); };

  const handleDeleteMeal = (id) => { Alert.alert('Elimina', 'Rimuovere questo pasto?', [{ text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deletePasto(id); loadMeals(selectedDiet.id); } }]); };

  const mealsByDay = {}; DAYS.forEach(day => { mealsByDay[day] = meals.filter(m => m.giorno === day); });

  if (loading && diets.length === 0) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {diets.length > 0 && (<FlatList horizontal data={diets} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<TouchableOpacity style={[styles.dietChip, selectedDiet?.id === item.id && styles.dietChipActive]} onPress={() => handleDietChange(item)}><Text style={selectedDiet?.id === item.id && styles.dietChipTextActive}>{item.nome}</Text></TouchableOpacity>)} contentContainerStyle={styles.dietList} />)}
      {diets.length === 0 ? (<View style={styles.empty}><Icon name="food" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessuna dieta</Text><CustomButton title="➕ CREA DIETA" onPress={() => navigation.navigate('AddDiet', { clientId })} style={styles.createBtn} /></View>) :
        (<FlatList data={DAYS} keyExtractor={item => item} renderItem={({ item: day }) => (<View style={styles.daySection}><Text style={styles.dayTitle}>{day}</Text>{mealsByDay[day]?.length > 0 ? mealsByDay[day].map(meal => (<TouchableOpacity key={meal.id} onLongPress={() => handleDeleteMeal(meal.id)}><MealCard meal={meal} /></TouchableOpacity>)) : <Text style={styles.noMeal}>Nessun pasto</Text>}</View>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />)}
      {diets.length > 0 && (<TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMeal', { dietId: selectedDiet?.id })}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, dietList: { paddingHorizontal: 15, paddingVertical: 10 },
  dietChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.grayLight, marginHorizontal: 5 },
  dietChipActive: { backgroundColor: colors.primary }, dietChipTextActive: { color: '#fff', fontWeight: 'bold' },
  daySection: { marginTop: 15 }, dayTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginLeft: 15, marginBottom: 10 },
  noMeal: { textAlign: 'center', color: colors.gray, padding: 20 }, empty: { flex: 1, justifyContent: 'center', alignItems: 'center' }, emptyText: { fontSize: 16, color: colors.gray, marginBottom: 20 },
  createBtn: { width: 200 }, fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});