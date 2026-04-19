import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Database } from '../database/Database';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatScreen({ route }) {
  const { clientId, clientName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  useEffect(() => { loadMessages(); const interval = setInterval(loadMessages, 3000); return () => clearInterval(interval); }, []);

  const loadMessages = async () => { const msgs = await Database.getChatMessaggi(clientId); setMessages(msgs); await Database.segnaLetto(clientId); };

  const sendMessage = async () => {
    if (!input.trim()) return;
    await Database.addMessaggio(clientId, 'professionista', input);
    setInput('');
    loadMessages();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <Text style={styles.header}>Chat con {clientName}</Text>
      <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id.toString()} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} renderItem={({ item }) => (<View style={[styles.message, item.mittente === 'professionista' ? styles.prof : styles.client]}><Text style={styles.text}>{item.messaggio}</Text><Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text></View>)} />
      <View style={styles.inputRow}><TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Scrivi un messaggio..." /><TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Icon name="send" size={24} color="#fff" /></TouchableOpacity></View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light }, header: { backgroundColor: colors.primary, color: '#fff', padding: 15, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  message: { maxWidth: '80%', padding: 10, borderRadius: 10, margin: 5 }, prof: { backgroundColor: colors.primary, alignSelf: 'flex-end' }, client: { backgroundColor: '#fff', alignSelf: 'flex-start' },
  text: { color: '#fff' }, time: { fontSize: 10, color: '#ddd', marginTop: 4 }, inputRow: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, backgroundColor: colors.light, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 }, sendBtn: { backgroundColor: colors.primary, borderRadius: 25, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});