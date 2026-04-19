import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../database/Database';
import { colors } from '../utils/colors';

export default function DashboardScreen({ navigation }) {
  const { professional, logout, ruolo } = useAuth();
  const [stats, setStats] = useState({ clienti: 0, diete: 0, appuntamenti: 0, fatture: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const clienti = await Database.getClienti();
    const appuntamenti = await Database.getAppuntamenti();
    const fatture = await Database.getFatture();
    setStats({ clienti: clienti.length, diete: 0, appuntamenti: appuntamenti.length, fatture: fatture.length });
  };

  useEffect(() => { loadStats(); }, []);

  const onRefresh = async () => { setRefreshing(true); await loadStats(); setRefreshing(false); };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}><Text style={styles.welcome}>Benvenuto,</Text><Text style={styles.profName}>{professional?.nome || 'Nutrizionista'}</Text></View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.clienti}</Text><Text style={styles.statTitle}>Clienti</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.appuntamenti}</Text><Text style={styles.statTitle}>Appuntamenti</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{stats.fatture}</Text><Text style={styles.statTitle}>Fatture</Text></View>
      </View>
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Azioni Rapide</Text>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AddClient')}><Text style={styles.actionText}>➕ Nuovo Cliente</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.info }]} onPress={() => navigation.navigate('AddFood')}><Text style={styles.actionText}>🥗 Nuovo Alimento</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.warning }]} onPress={() => navigation.navigate('Appuntamenti')}><Text style={styles.actionText}>📅 Appuntamenti</Text></TouchableOpacity>
        {ruolo === 'admin' && <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.danger }]} onPress={() => navigation.navigate('Utenti')}><Text style={styles.actionText}>👥 Gestione Utenti</Text></TouchableOpacity>}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.info }]} onPress={() => navigation.navigate('Backup')}><Text style={styles.actionText}>☁️ Backup Cloud</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>🚪 Esci</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, header: { backgroundColor: colors.primary, padding: 20, paddingTop: 40, paddingBottom: 30 },
  welcome: { color: '#fff', fontSize: 16 }, profName: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, marginTop: -20 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, margin: 8, width: '44%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: colors.primary }, statTitle: { fontSize: 14, color: colors.gray, marginTop: 5 },
  quickActions: { padding: 15 }, sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  actionButton: { padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 5 }, actionText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { margin: 20, padding: 15, backgroundColor: colors.danger, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});