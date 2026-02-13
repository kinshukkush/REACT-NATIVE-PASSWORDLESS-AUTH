import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  validateOTP,
  getOTPRemainingTime,
  getAttemptCount,
  createOTP,
} from '../services/otpManager';

interface OtpScreenProps {
  email: string;
  onNavigate: (screen: 'session', email: string) => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  email,
  onNavigate,
  onBack,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remainingTime, setRemainingTime] = useState(60);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeOTPScreen();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const initializeOTPScreen = async () => {
    const time = await getOTPRemainingTime(email);
    const attempts = await getAttemptCount(email);

    setRemainingTime(time);
    setAttemptCount(attempts);

    startCountdown(time);
  };

  const startCountdown = (initialTime: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let timeLeft = initialTime;
    setRemainingTime(timeLeft);

    timerRef.current = setInterval(async () => {
      timeLeft = await getOTPRemainingTime(email);
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }, 1000);
  };

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '');

    if (digit.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit[digit.length - 1];
    setOtp(newOtp);

    if (index < 5 && digit.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && digit.length > 0) {
      const fullOtp = [...newOtp.slice(0, 5), digit[digit.length - 1]].join('');
      handleVerifyOTP(fullOtp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpToVerify?: string) => {
    const otpValue = otpToVerify || otp.join('');

    if (otpValue.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    if (remainingTime <= 0) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await validateOTP(email, otpValue);

      if (result.isValid) {
        onNavigate('session', email);
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid OTP');

        const attempts = await getAttemptCount(email);
        setAttemptCount(attempts);

        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const newOtp = await createOTP(email);

      setOtp(['', '', '', '', '', '']);
      setAttemptCount(0);

      startCountdown(60);

      console.log('\n');
      console.log('═══════════════════════════════════════');
      console.log('🔄 NEW OTP CODE (Resent)');
      console.log('═══════════════════════════════════════');
      console.log(`   OTP: ${newOtp}`);
      console.log(`   Email: ${email}`);
      console.log(`   Valid for: 60 seconds`);
      console.log('═══════════════════════════════════════');
      console.log('\n');

      Alert.alert(
        '✅ New OTP Generated!',
        `Your new 6-digit OTP is:\n\n${newOtp}\n\nThis code is valid for 60 seconds.\n\n(Previous OTP has been invalidated)`
      );

      inputRefs.current[0]?.focus();
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
            />
          ))}
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoBadge, remainingTime <= 10 && styles.infoBadgeWarning]}>
            <Text style={styles.infoLabel}>Time remaining</Text>
            <Text style={styles.infoValue}>{formatTime(remainingTime)}</Text>
          </View>

          <View style={[styles.infoBadge, attemptCount >= 2 && styles.infoBadgeWarning]}>
            <Text style={styles.infoLabel}>Attempts left</Text>
            <Text style={styles.infoValue}>{3 - attemptCount}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={() => handleVerifyOTP()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={isResending || remainingTime > 0}
        >
          {isResending ? (
            <ActivityIndicator color="#007AFF" size="small" />
          ) : (
            <Text
              style={[
                styles.resendButtonText,
                remainingTime > 0 && styles.resendButtonTextDisabled,
              ]}
            >
              {remainingTime > 0 ? 'Resend available after timer expires' : 'Resend OTP'}
            </Text>
          )}
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
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  email: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoBadge: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 12,
  },
  infoBadgeWarning: {
    backgroundColor: '#ffebee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    padding: 12,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
});
