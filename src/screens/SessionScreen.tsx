import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { logAnalyticsEvent } from '../services/analytics';

interface SessionScreenProps {
  email: string;
  onLogout: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  email,
  onLogout,
}) => {
  const { formattedTime, startTimer, stopTimer, elapsedSeconds } = useSessionTimer();

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
    };
  }, []);

  const getSessionStartTime = (): string => {
    const now = new Date();
    const startTime = new Date(now.getTime() - elapsedSeconds * 1000);

    return startTime.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            stopTimer();

            await logAnalyticsEvent('logout', {
              email,
              sessionDuration: elapsedSeconds,
            });

            onLogout();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.sessionCard}>
          <Text style={styles.cardTitle}>Active Session</Text>

          <View style={styles.sessionInfo}>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionLabel}>Session Started</Text>
              <Text style={styles.sessionValue}>{getSessionStartTime()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.sessionItem}>
              <Text style={styles.sessionLabel}>Session Duration</Text>
              <Text style={styles.sessionValueLarge}>{formattedTime}</Text>
              <Text style={styles.sessionSubtext}>mm:ss</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your session is being tracked. The timer will continue running even
            if you switch apps.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  sessionInfo: {
    gap: 20,
  },
  sessionItem: {
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sessionValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sessionValueLarge: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 2,
  },
  sessionSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
