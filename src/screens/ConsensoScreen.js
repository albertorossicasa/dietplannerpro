import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Database } from '../database/Database';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ConsensoScreen({ route }) {
  const { clientId } = route.params;
  const [consenso, setConsenso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadConsenso(); }, []);

  const loadConsenso = async () => { const c = await Database.getConsenso(clientId); setConsenso(c); setLoading(false); };

  const accetta = async () => {
    const firma = `Firma digitale ${new Date().toISOString()}`;
    await Database.setConsenso(clientId, true, firma);
    loadConsenso();
    Alert.alert('Grazie', 'Consenso registrato');
  };

  const esportaPDF = async () => {
    const content = `CONSENSO INFORMATO\n\nData: ${new Date().toISOString()}\nCliente ID: ${clientId}\nAccettato: ${consenso?.accettato ? 'Sì' : 'No'}\nFirma: ${consenso?.firma || 'N/A'}\n\nIo sottoscritto acconsento al trattamento dei dati personali per finalità di cura nutrizionale.`;
    const path = FileSystem.documentDirectory + `consenso_${clientId}.txt`;
    await FileSystem.writeAsStringAsync(path, content);
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path);
  };

  if (loading) return <Text>Caricamento...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📄 Consenso Informato</Text>
      <Text style={styles.text}>Io sottoscritto, ai sensi del GDPR 2016/679, acconsento al trattamento dei miei dati personali (anagrafici, sanitari, nutrizionali) da parte del professionista per finalità di cura, prevenzione e gestione del percorso nutrizionale.</Text>
      {consenso?.accettato ? (<View style={styles.accepted}><Text style={styles.acceptedText}>✅ Consenso già firmato il {new Date(consenso.data_consenso).toLocaleDateString()}</Text><CustomButton title="📄 Esporta PDF" onPress={esportaPDF} style={styles.exportBtn} /></View>) : (<CustomButton title="✍️ ACCETTA CONSENSO" onPress={accetta} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 }, title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  text: { fontSize: 16, lineHeight: 24, marginBottom: 30 }, accepted: { alignItems: 'center' }, acceptedText: { color: colors.success, fontSize: 16, marginBottom: 20 }, exportBtn: { width: 150 }
});