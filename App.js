import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { DatabaseProvider } from './src/database/Database';

// SCREENS
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClientsListScreen from './src/screens/ClientsListScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import AddClientScreen from './src/screens/AddClientScreen';
import EditClientScreen from './src/screens/EditClientScreen';
import FoodsListScreen from './src/screens/FoodsListScreen';
import AddFoodScreen from './src/screens/AddFoodScreen';
import DietScreen from './src/screens/DietScreen';
import AddDietScreen from './src/screens/AddDietScreen';
import AddMealScreen from './src/screens/AddMealScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import AddMonitoringScreen from './src/screens/AddMonitoringScreen';
import FotoProgressoScreen from './src/screens/FotoProgressoScreen';
import InvoicesScreen from './src/screens/InvoicesScreen';
import AddInvoiceScreen from './src/screens/AddInvoiceScreen';
import ListaSpesaScreen from './src/screens/ListaSpesaScreen';
import TrackingAcquaScreen from './src/screens/TrackingAcquaScreen';
import CalcoloFabbisognoScreen from './src/screens/CalcoloFabbisognoScreen';
import AppuntamentiScreen from './src/screens/AppuntamentiScreen';
import AddAppuntamentoScreen from './src/screens/AddAppuntamentoScreen';
import ConsensoScreen from './src/screens/ConsensoScreen';
import ChatScreen from './src/screens/ChatScreen';
import BackupScreen from './src/screens/BackupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UtentiScreen from './src/screens/UtentiScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#2ecc71', background: '#f5f5f5' }
};

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = { Dashboard: 'view-dashboard', Clienti: 'account-group', Alimenti: 'food-apple', Profilo: 'account' };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2ecc71',
      headerStyle: { backgroundColor: '#2ecc71' },
      headerTintColor: '#fff'
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Clienti" component={ClientsListScreen} />
      <Tab.Screen name="Alimenti" component={FoodsListScreen} />
      <Tab.Screen name="Profilo" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2ecc71' }, headerTintColor: '#fff' }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: 'Dettaglio Cliente' }} />
          <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: 'Nuovo Cliente' }} />
          <Stack.Screen name="EditClient" component={EditClientScreen} options={{ title: 'Modifica Cliente' }} />
          <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ title: 'Nuovo Alimento' }} />
          <Stack.Screen name="DietScreen" component={DietScreen} options={{ title: 'Gestione Dieta' }} />
          <Stack.Screen name="AddDiet" component={AddDietScreen} options={{ title: 'Nuova Dieta' }} />
          <Stack.Screen name="AddMeal" component={AddMealScreen} options={{ title: 'Aggiungi Pasto' }} />
          <Stack.Screen name="MonitoringScreen" component={MonitoringScreen} options={{ title: 'Monitoraggio Peso' }} />
          <Stack.Screen name="AddMonitoring" component={AddMonitoringScreen} options={{ title: 'Nuova Rilevazione' }} />
          <Stack.Screen name="FotoProgresso" component={FotoProgressoScreen} options={{ title: 'Foto Progresso' }} />
          <Stack.Screen name="InvoicesScreen" component={InvoicesScreen} options={{ title: 'Fatture' }} />
          <Stack.Screen name="AddInvoice" component={AddInvoiceScreen} options={{ title: 'Nuova Fattura' }} />
          <Stack.Screen name="ListaSpesa" component={ListaSpesaScreen} options={{ title: 'Lista della Spesa' }} />
          <Stack.Screen name="TrackingAcqua" component={TrackingAcquaScreen} options={{ title: 'Tracking Acqua' }} />
          <Stack.Screen name="CalcoloFabbisogno" component={CalcoloFabbisognoScreen} options={{ title: 'Calcolo Fabbisogno' }} />
          <Stack.Screen name="Appuntamenti" component={AppuntamentiScreen} options={{ title: 'Appuntamenti' }} />
          <Stack.Screen name="AddAppuntamento" component={AddAppuntamentoScreen} options={{ title: 'Nuovo Appuntamento' }} />
          <Stack.Screen name="Consenso" component={ConsensoScreen} options={{ title: 'Consenso GDPR' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
          <Stack.Screen name="Backup" component={BackupScreen} options={{ title: 'Backup Cloud' }} />
          <Stack.Screen name="Utenti" component={UtentiScreen} options={{ title: 'Gestione Utenti' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Impostazioni' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <DatabaseProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </DatabaseProvider>
    </PaperProvider>
  );
}