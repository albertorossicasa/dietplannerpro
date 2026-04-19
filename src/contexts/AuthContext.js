import React, { createContext, useState, useContext, useEffect } from 'react';
import { Database } from '../database/Database';
import * as Crypto from 'expo-crypto';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ruolo, setRuolo] = useState(null);

  useEffect(() => { checkLoginStatus(); }, []);

  const hashPassword = async (password) => {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  };

  const checkLoginStatus = async () => {
    setIsLoading(false);
  };

  const login = async (username, password) => {
    const hash = await hashPassword(password);
    const valid = await Database.verifyLogin(username, hash);
    if (valid) {
      setIsAuthenticated(true);
      setUser({ username });
      const prof = await Database.getProfessionista();
      setRuolo(prof ? 'admin' : 'operatore');
      return { success: true };
    }
    return { success: false, error: 'Credenziali non valide' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRuolo(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, ruolo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};