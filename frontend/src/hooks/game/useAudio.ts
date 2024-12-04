import { useCallback, useEffect, useRef } from "react";

export const useAudio = (sourceUrl: string) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioContext = window.AudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const loadAudio = async () => {
      try {
        const res = await fetch(sourceUrl);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    return () => {
      audioContext.close();
    };
  }, [sourceUrl]);

  const playSound = useCallback(() => {
    if (audioContextRef.current && audioBufferRef.current) {
      const trackSource = audioContextRef.current.createBufferSource();
      trackSource.buffer = audioBufferRef.current;
      trackSource.connect(audioContextRef.current.destination);

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      trackSource.start();
    }
  }, []);

  return playSound;
};
