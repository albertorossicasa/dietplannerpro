import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BackupScreen() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadBackups(); }, []);

  const loadBackups = async () => { const data = await Database.getBackupLog(); setBackups(data); };

  const creaBackup = async () => {
    setLoading(true);
    const path = await Database.backupDatabase();
    Alert.alert('Successo', `Backup creato: ${path}`);
    loadBackups();
    setLoading(false);
  };

  const condividiBackup = async (path) => { if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path); };

  return (
    <View style={styles.container}>
      <CustomButton title={loading ? 'Creazione...' : '☁️ CREA BACKUP'} onPress={creaBackup} loading={loading} />
      <Text style={styles.title}>📋 Backup precedenti</Text>
      <FlatList data={backups} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (<View style={styles.item}><View><Text style={styles.date}>{item.data_backup}</Text><Text style={styles.path}>{item.percorso_file?.split('/').pop()}</Text></View><TouchableOpacity onPress={() => condividiBackup(item.percorso_file)}><Icon name="share" size={24} color={colors.primary} /></TouchableOpacity></View>)} ListEmptyComponent={<Text style={styles.empty}>Nessun backup</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 }, title: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  date: { fontWeight: 'bold' }, path: { fontSize: 12, color: colors.gray }, empty: { textAlign: 'center', color: colors.gray, marginTop: 50 }
});