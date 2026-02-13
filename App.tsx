import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { OtpScreen } from './src/screens/OtpScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { AuthScreen } from './src/types/auth';
import { initializeAnalytics } from './src/services/analytics';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeAnalytics();
      setIsInitializing(false);
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize app');
      setIsInitializing(false);
    }
  };

  const handleNavigateToOTP = (_screen: 'otp', email: string) => {
    setUserEmail(email);
    setCurrentScreen('otp');
  };

  const handleNavigateToSession = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('session');
  };

  const handleNavigateToLogin = () => {
    setUserEmail('');
    setCurrentScreen('login');
  };

  const handleLogout = () => {
    setUserEmail('');
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onNavigate={handleNavigateToOTP} />;

      case 'otp':
        return (
          <OtpScreen
            email={userEmail}
            onNavigate={handleNavigateToSession}
            onBack={handleNavigateToLogin}
          />
        );

      case 'session':
        return <SessionScreen email={userEmail} onLogout={handleLogout} />;

      default:
        return <LoginScreen onNavigate={handleNavigateToOTP} />;
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.errorSubtext}>Please restart the app</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      {renderScreen()}
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
