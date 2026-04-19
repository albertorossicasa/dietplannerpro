import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../utils/colors';

export default function CustomButton({ title, onPress, loading, variant = 'primary', style }) {
  const bgColor = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : colors.info;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }, style]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginVertical: 5 },
  text: { color: colors.white, fontSize: 16, fontWeight: 'bold' }
});