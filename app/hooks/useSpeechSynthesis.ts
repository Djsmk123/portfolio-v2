"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UseSpeachSynthesisApi = {
  text: string;
  setText: (value: string) => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isResumed: boolean;
  isEnded: boolean;
  speak: () => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
};

// Intentionally keep the exported name matching the user's request
export const useSpeachSynthesisApi = (): UseSpeachSynthesisApi => {
  const [text, setText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isResumed, setIsResumed] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Load voices and pick a likely female voice
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredNames = [
        "Google US English Female",
        "Microsoft Zira Desktop - English (United States)",
        "Samantha",
        "Google UK English Female",
      ];
      const byName = voices.find((v) => preferredNames.includes(v.name));
      const enFem = voices.find((v) => v.lang.startsWith("en") && /female/i.test(v.name));
      voiceRef.current = byName ?? enFem ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      if (window.speechSynthesis.onvoiceschanged === pickVoice) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text) return;
    // Cancel any existing utterance
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.voice = voiceRef.current ?? null;
    msg.rate = 1.0;
    msg.pitch = 1.05;
    msg.volume = 1.0;

    msg.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setIsEnded(false);
      setIsResumed(false);
    };
    msg.onpause = () => {
      setIsPaused(true);
      setIsSpeaking(false);
    };
    msg.onresume = () => {
      setIsPaused(false);
      setIsResumed(true);
      setIsSpeaking(true);
    };
    msg.onend = () => {
      setIsEnded(true);
      setIsSpeaking(false);
      setIsPaused(false);
      setIsResumed(false);
    };
    msg.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsResumed(false);
      setIsEnded(true);
    };

    utteranceRef.current = msg;
    window.speechSynthesis.speak(msg);
  }, [text]);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
    setIsEnded(false);
    setIsResumed(false);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsSpeaking(true);
    setIsEnded(false);
    setIsResumed(true);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsResumed(false);
    setIsSpeaking(false);
    setIsEnded(true);
  }, []);

  return {
    text,
    setText,
    isSpeaking,
    isPaused,
    isResumed,
    isEnded,
    speak,
    pause,
    resume,
    cancel,
  };
};


