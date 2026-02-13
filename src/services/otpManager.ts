import AsyncStorage from '@react-native-async-storage/async-storage';

import { OTPStorage, OTPMetadata } from '../types/auth';
import { logAnalyticsEvent } from './analytics';

const OTP_STORAGE_KEY = '@otp_storage';
const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60;
const MAX_ATTEMPTS = 3;

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const loadOTPStorage = async (): Promise<OTPStorage> => {
  try {
    const data = await AsyncStorage.getItem(OTP_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading OTP storage:', error);
    return {};
  }
};

const saveOTPStorage = async (storage: OTPStorage): Promise<void> => {
  try {
    await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving OTP storage:', error);
  }
};

export const createOTP = async (email: string): Promise<string> => {
  const otp = generateOTP();
  const now = Date.now();

  const storage = await loadOTPStorage();

  const metadata: OTPMetadata = {
    otp,
    expiryTimestamp: now + OTP_EXPIRY_SECONDS * 1000,
    attemptCount: 0,
    generatedAt: now,
  };

  storage[email] = metadata;
  await saveOTPStorage(storage);

  await logAnalyticsEvent('otp_generated', { email });

  return otp;
};

export interface OTPValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateOTP = async (
  email: string,
  otp: string
): Promise<OTPValidationResult> => {
  const storage = await loadOTPStorage();
  const metadata = storage[email];

  if (!metadata) {
    await logAnalyticsEvent('otp_validation_failed', { email, reason: 'no_otp' });
    return { isValid: false, error: 'No OTP found. Please request a new one.' };
  }

  const now = Date.now();
  if (now > metadata.expiryTimestamp) {
    delete storage[email];
    await saveOTPStorage(storage);
    await logAnalyticsEvent('otp_validation_failed', { email, reason: 'expired' });
    return { isValid: false, error: 'OTP has expired. Please request a new one.' };
  }

  if (metadata.attemptCount >= MAX_ATTEMPTS) {
    await logAnalyticsEvent('otp_validation_failed', { email, reason: 'max_attempts' });
    return { isValid: false, error: 'Maximum attempts exceeded. Please request a new OTP.' };
  }

  metadata.attemptCount++;
  storage[email] = metadata;
  await saveOTPStorage(storage);

  if (metadata.otp === otp) {
    delete storage[email];
    await saveOTPStorage(storage);
    await logAnalyticsEvent('otp_validation_success', { email });
    return { isValid: true };
  } else {
    await logAnalyticsEvent('otp_validation_failed', {
      email,
      reason: 'incorrect',
      attemptsRemaining: MAX_ATTEMPTS - metadata.attemptCount
    });
    return {
      isValid: false,
      error: `Incorrect OTP. ${MAX_ATTEMPTS - metadata.attemptCount} attempts remaining.`
    };
  }
};

export const getOTPRemainingTime = async (email: string): Promise<number> => {
  const storage = await loadOTPStorage();
  const metadata = storage[email];

  if (!metadata) return 0;

  const now = Date.now();
  const remaining = Math.max(0, Math.ceil((metadata.expiryTimestamp - now) / 1000));

  return remaining;
};

export const getAttemptCount = async (email: string): Promise<number> => {
  const storage = await loadOTPStorage();
  const metadata = storage[email];

  return metadata ? metadata.attemptCount : 0;
};

export const clearAllOTPs = async (): Promise<void> => {
  await AsyncStorage.removeItem(OTP_STORAGE_KEY);
};
