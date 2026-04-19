import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';

export default function ClientCard({ client, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{client.nome?.charAt(0)}{client.cognome?.charAt(0)}</Text></View>
      <View style={styles.info}>
        <Text style={styles.name}>{client.nome} {client.cognome}</Text>
        <Text style={styles.detail}><Icon name="email" size={12} /> {client.email || 'N/A'}</Text>
        <Text style={styles.detail}><Icon name="phone" size={12} /> {client.telefono || 'N/A'}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 15, marginHorizontal: 15, marginVertical: 5, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 }, name: { fontSize: 16, fontWeight: 'bold', color: colors.dark, marginBottom: 4 },
  detail: { fontSize: 12, color: colors.gray, marginTop: 2 }
});