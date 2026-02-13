export interface OTPMetadata {
  otp: string;
  expiryTimestamp: number;
  attemptCount: number;
  generatedAt: number;
}

export interface OTPStorage {
  [email: string]: OTPMetadata;
}

export interface SessionData {
  email: string;
  startTime: number;
}

export interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type AuthScreen = 'login' | 'otp' | 'session';
