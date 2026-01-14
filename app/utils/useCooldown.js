import { useState, useEffect } from "react";

export const useCooldown = (key) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Check LocalStorage for an existing active timer
  useEffect(() => {
    // Safety check for Server Side Rendering 
    if (typeof window === "undefined" || !key) return;

    const savedEndTime = localStorage.getItem(key);
    
    if (savedEndTime) {
      const now = Date.now();
      const endTime = parseInt(savedEndTime, 10);
      const remainingSeconds = Math.ceil((endTime - now) / 1000);

      if (remainingSeconds > 0) {
        setTimeLeft(remainingSeconds);
      } else {
        // Clean up expired timer
        localStorage.removeItem(key);
      }
    }
  }, [key]);

  // The Countdown Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      // If timer hits 0, clear storage so the button re-enables
      if (key && typeof window !== "undefined") {
         // Only clear if we actually stored something previously to avoid unnecessary writes
         if(localStorage.getItem(key)) localStorage.removeItem(key);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, key]);

  // Start Cooldown & Save to Storage
  const startCooldown = (seconds) => {
    setTimeLeft(seconds);

    if (key && typeof window !== "undefined") {
      const endTime = Date.now() + seconds * 1000; // Current time + seconds
      localStorage.setItem(key, endTime.toString());
    }
  };

  // Helper: Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return { timeLeft, startCooldown, formatTime };
};