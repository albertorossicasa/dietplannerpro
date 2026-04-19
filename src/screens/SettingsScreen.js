import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const clearCache = () => {
    Alert.alert('Pulizia Cache', 'Cancellare la cache dell\'app?', [
      { text: 'Annulla' },
      { text: 'Cancella', onPress: async () => {
        await AsyncStorage.clear();
        Alert.alert('Successo', 'Cache cancellata');
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferenze</Text>
        <View style={styles.row}><Text style={styles.label}>Notifiche push</Text><Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.grayLight, true: colors.primary }} /></View>
        <View style={styles.row}><Text style={styles.label}>Modalità scura</Text><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: colors.grayLight, true: colors.primary }} /></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dati</Text>
        <CustomButton title="🗑️ Cancella Cache" variant="danger" onPress={clearCache} />
        <CustomButton title="💾 Backup Database" variant="primary" onPress={() => navigation.navigate('Backup')} style={styles.btn} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni</Text>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Versione</Text><Text style={styles.infoValue}>1.0.0</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Build</Text><Text style={styles.infoValue}>2025.04</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Licenza</Text><Text style={styles.infoValue}>PRO Completa</Text></View>
      </View>
      <Text style={styles.copyright}>© 2025 DietPlannerPro{'\n'}Tutti i diritti riservati</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 15 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  label: { fontSize: 14 }, btn: { marginTop: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: colors.gray }, infoValue: { fontSize: 14, color: colors.dark },
  copyright: { textAlign: 'center', color: colors.gray, fontSize: 12, marginTop: 20, marginBottom: 30 }
});