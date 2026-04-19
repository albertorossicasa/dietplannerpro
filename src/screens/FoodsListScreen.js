import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import FoodItem from '../components/FoodItem';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors } from '../utils/colors';

export default function FoodsListScreen({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(['Tutti']);
  const [selectedCat, setSelectedCat] = useState('Tutti');

  const loadFoods = async () => {
    const data = await Database.getAlimenti();
    setFoods(data);
    setFiltered(data);
    const unique = ['Tutti', ...new Set(data.map(f => f.categoria).filter(Boolean))];
    setCategories(unique);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { loadFoods(); }, []));

  useEffect(() => {
    let f = foods;
    if (selectedCat !== 'Tutti') f = f.filter(food => food.categoria === selectedCat);
    if (search) f = f.filter(food => food.nome.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [search, selectedCat, foods]);

  const onRefresh = async () => { setRefreshing(true); await loadFoods(); setRefreshing(false); };

  const handleDelete = (id, nome) => {
    Alert.alert('Elimina', `Eliminare ${nome}?`, [
      { text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteAlimento(id); loadFoods(); } }
    ]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Cerca alimento..." />
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={item => item} renderItem={({ item }) => (
        <TouchableOpacity style={[styles.chip, selectedCat === item && styles.chipActive]} onPress={() => setSelectedCat(item)}><Text style={selectedCat === item && styles.chipTextActive}>{item}</Text></TouchableOpacity>
      )} contentContainerStyle={styles.chipList} />
      <FlatList data={filtered} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (
        <TouchableOpacity onLongPress={() => handleDelete(item.id, item.nome)}><FoodItem food={item} /></TouchableOpacity>
      )} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<View style={styles.empty}><Icon name="food-apple" size={60} color={colors.grayLight} /><Text style={styles.emptyText}>Nessun alimento</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddFood')}><Icon name="plus" size={28} color="#fff" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, chipList: { paddingHorizontal: 10, paddingVertical: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginHorizontal: 4, borderWidth: 1, borderColor: colors.grayLight },
  chipActive: { backgroundColor: colors.primary }, chipTextActive: { color: '#fff', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 100 }, emptyText: { fontSize: 16, color: colors.gray, marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});