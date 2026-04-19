import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Database } from '../database/Database';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';
import { formatDate, calculateBMI, getBMICategory } from '../utils/helpers';
import * as FileSystem from 'expo-file-system';

export default function ClientDetailScreen({ route, navigation }) {
  const { clientId, client: initialClient } = route.params;
  const [client, setClient] = useState(initialClient);
  const [loading, setLoading] = useState(!initialClient);
  const [diete, setDiete] = useState([]);
  const [fotoProfilo, setFotoProfilo] = useState(null);
  const [alimentiVietati, setAlimentiVietati] = useState([]);

  useEffect(() => {
    if (!initialClient) loadClient();
    loadDiete();
    loadFotoProfilo();
    if (client?.patologia) loadAlimentiVietati();
  }, [client]);

  const loadClient = async () => { const data = await Database.getCliente(clientId); setClient(data); setLoading(false); };
  const loadDiete = async () => { const data = await Database.getDieteByCliente(clientId); setDiete(data); };
  const loadFotoProfilo = async () => { const path = await Database.getFotoProfilo(clientId); if (path) setFotoProfilo(path); };
  const loadAlimentiVietati = async () => { const vietati = await Database.getAlimentiVietatiByPatologie(client.patologia); setAlimentiVietati(vietati); };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permesso negato'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = `foto_${clientId}_${Date.now()}.jpg`;
      const destPath = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: uri, to: destPath });
      await Database.saveFotoProfilo(clientId, destPath);
      setFotoProfilo(destPath);
    }
  };

  const handleDelete = () => {
    Alert.alert('Conferma', `Eliminare ${client?.nome} ${client?.cognome}?`, [
      { text: 'Annulla' }, { text: 'Elimina', style: 'destructive', onPress: async () => { await Database.deleteCliente(clientId); navigation.goBack(); } }
    ]);
  };

  if (loading) return <LoadingSpinner />;

  const bmi = calculateBMI(client?.peso_kg, client?.altezza_cm);
  const eta = client?.data_nascita ? new Date().getFullYear() - parseInt(client.data_nascita.split('/')[2]) : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          {fotoProfilo ? <Image source={{ uri: fotoProfilo }} style={styles.avatarLarge} /> :
            <View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>{client?.nome?.charAt(0)}{client?.cognome?.charAt(0)}</Text></View>}
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
        <Text style={styles.name}>{client?.nome} {client?.cognome}</Text>
        <Text style={styles.cf}>{client?.codice_fiscale}</Text>
        {client?.patologia ? <Text style={styles.patologia}>⚠️ {client.patologia}</Text> : null}
      </View>

      <View style={styles.card}><Text style={styles.sectionTitle}>📋 Informazioni</Text>
        <View style={styles.infoRow}><Icon name="calendar" size={20} /><Text style={styles.infoText}>Nato: {formatDate(client?.data_nascita)} ({eta} anni)</Text></View>
        <View style={styles.infoRow}><Icon name="phone" size={20} /><Text style={styles.infoText}>Tel: {client?.telefono || 'N/D'}</Text></View>
        <View style={styles.infoRow}><Icon name="email" size={20} /><Text style={styles.infoText}>Email: {client?.email || 'N/D'}</Text></View>
      </View>

      <View style={styles.card}><Text style={styles.sectionTitle}>📊 Dati biometrici</Text>
        <View style={styles.bioRow}>
          <View><Text style={styles.bioValue}>{client?.altezza_cm || 0} cm</Text><Text style={styles.bioLabel}>Altezza</Text></View>
          <View><Text style={styles.bioValue}>{client?.peso_kg || 0} kg</Text><Text style={styles.bioLabel}>Peso</Text></View>
          {bmi && <View><Text style={styles.bioValue}>{bmi}</Text><Text style={styles.bioLabel}>BMI ({getBMICategory(parseFloat(bmi))})</Text></View>}
        </View>
      </View>

      {alimentiVietati.length > 0 && (<View style={styles.cardWarning}><Text style={styles.sectionTitle}>🚫 Alimenti vietati per {client?.patologia}</Text>{alimentiVietati.map((a, idx) => <Text key={idx} style={styles.vietato}>• {a}</Text>)}</View>)}

      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DietScreen', { clientId })}><Icon name="food" size={28} color={colors.primary} /><Text>Diete</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MonitoringScreen', { clientId })}><Icon name="scale" size={28} color={colors.primary} /><Text>Peso</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('FotoProgresso', { clientId })}><Icon name="camera" size={28} color={colors.primary} /><Text>Foto</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('InvoicesScreen', { clientId })}><Icon name="file-document" size={28} color={colors.primary} /><Text>Fatture</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ListaSpesa', { clientId, dietId: diete[0]?.id })}><Icon name="cart" size={28} color={colors.primary} /><Text>Lista spesa</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('TrackingAcqua', { clientId })}><Icon name="cup-water" size={28} color={colors.primary} /><Text>Acqua</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CalcoloFabbisogno', { clientId, cliente: { ...client, eta, livelloAttivita: 'moderato' } })}><Icon name="calculator" size={28} color={colors.primary} /><Text>Fabbisogno</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Appuntamenti', { clientId })}><Icon name="calendar" size={28} color={colors.primary} /><Text>Appuntamenti</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Consenso', { clientId })}><Icon name="file-sign" size={28} color={colors.primary} /><Text>Consenso</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Chat', { clientId, clientName: client?.nome })}><Icon name="chat" size={28} color={colors.primary} /><Text>Chat</Text></TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <CustomButton title="✏️ Modifica" variant="primary" onPress={() => navigation.navigate('EditClient', { clientId, client })} />
        <CustomButton title="🗑️ Elimina" variant="danger" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, header: { backgroundColor: colors.primary, alignItems: 'center', paddingVertical: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarLargeText: { fontSize: 32, fontWeight: 'bold', color: colors.primary }, cameraIcon: { position: 'absolute', bottom: 10, right: 0, fontSize: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 }, cf: { fontSize: 14, color: '#fff', opacity: 0.9 },
  patologia: { marginTop: 8, backgroundColor: '#ff9800', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, color: '#fff' },
  card: { backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  cardWarning: { backgroundColor: '#fff3e0', margin: 15, padding: 15, borderRadius: 15, borderLeftWidth: 4, borderLeftColor: '#ff9800' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 }, infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, infoText: { marginLeft: 10, fontSize: 14 },
  bioRow: { flexDirection: 'row', justifyContent: 'space-around' }, bioValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  bioLabel: { fontSize: 12, color: colors.gray, textAlign: 'center' }, vietato: { fontSize: 14, color: colors.danger, marginVertical: 2 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: 10 },
  actionBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 12, margin: 6, alignItems: 'center', width: 100, elevation: 2 },
  actions: { padding: 15, marginBottom: 30 }
});