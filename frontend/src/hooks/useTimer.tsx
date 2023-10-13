import { useState, useEffect } from "react";

interface UseTimerReturnType {
  seconds: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const useTimer = (): UseTimerReturnType => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  let interval: NodeJS.Timeout | undefined;

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  return { seconds, startTimer, pauseTimer, resetTimer };
};

export default useTimer;
