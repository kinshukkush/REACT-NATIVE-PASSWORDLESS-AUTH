import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsEvent } from '../types/auth';

const ANALYTICS_KEY = '@analytics_events';
const MAX_EVENTS = 100;

export const initializeAnalytics = async (): Promise<void> => {
  try {
    await AsyncStorage.getItem(ANALYTICS_KEY);
    console.log('✅ Analytics service initialized with AsyncStorage');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

export const logAnalyticsEvent = async (
  eventName: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      metadata,
    };

    const eventsJson = await AsyncStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = eventsJson ? JSON.parse(eventsJson) : [];

    events.push(event);

    const trimmedEvents = events.slice(-MAX_EVENTS);

    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedEvents));

    console.log(`📊 Analytics Event: ${eventName}`, metadata);
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
};

export const getAnalyticsEvents = async (): Promise<AnalyticsEvent[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(ANALYTICS_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Failed to get analytics events:', error);
    return [];
  }
};

export const clearAnalyticsEvents = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.error('Failed to clear analytics events:', error);
  }
};
