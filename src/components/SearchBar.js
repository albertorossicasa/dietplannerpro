import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';

export default function SearchBar({ value, onChangeText, placeholder = 'Cerca...' }) {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color={colors.gray} style={styles.icon} />
      <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} />
      {value ? <Icon name="close" size={20} color={colors.gray} onPress={() => onChangeText('')} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 10, margin: 10, borderWidth: 1, borderColor: colors.grayLight },
  icon: { padding: 8 }, input: { flex: 1, paddingVertical: 10, fontSize: 16 }
});