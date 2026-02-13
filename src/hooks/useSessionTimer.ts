import { useState, useEffect, useRef, useMemo } from 'react';

interface UseSessionTimerReturn {
  elapsedSeconds: number;
  formattedTime: string;
  startTimer: () => void;
  stopTimer: () => void;
  isRunning: boolean;
}

export const useSessionTimer = (startTime?: number): UseSessionTimerReturn => {
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(
    startTime || null
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && sessionStartTime) {
      const calculateElapsed = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setElapsedSeconds(elapsed);
      };

      calculateElapsed();

      intervalRef.current = setInterval(calculateElapsed, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isRunning, sessionStartTime]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  return {
    elapsedSeconds,
    formattedTime,
    startTimer,
    stopTimer,
    isRunning,
  };
};
