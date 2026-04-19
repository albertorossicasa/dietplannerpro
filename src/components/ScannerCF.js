import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { validazioneCF } from '../utils/codiceFiscale';

export default function ScannerCF({ onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    if (validazioneCF(data)) {
      onScan(data);
    } else {
      Alert.alert('Errore', 'Codice fiscale non valido, riprova');
      setScanned(false);
    }
  };

  if (hasPermission === null) return <Text>Richiedo accesso fotocamera...</Text>;
  if (hasPermission === false) return <Text>Accesso fotocamera negato</Text>;

  return (
    <View style={styles.container}>
      <Camera onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={styles.camera} />
      <View style={styles.overlay}>
        <Text style={styles.text}>Inquadra il codice fiscale</Text>
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 20, alignItems: 'center' },
  text: { color: 'white', fontSize: 16, marginBottom: 10 },
  button: { backgroundColor: '#2ecc71', padding: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});