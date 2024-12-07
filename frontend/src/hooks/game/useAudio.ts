import { useVolumeStore } from "@store/volumeStore";
import { useCallback, useEffect, useRef } from "react";

/**
 * @description 효과음 실행 함수를 만들어서 반환하는 커스텀 훅
 * @param sourceUrl 오디오 파일 경로 (public기준)
 */
export const useAudio = (sourceUrl: string) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const effectVolume = useVolumeStore((state) => state.effectVolume);

  useEffect(() => {
    const AudioContext = window.AudioContext;
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    gainNodeRef.current = gainNode;

    const loadAudio = async () => {
      try {
        const res = await fetch(sourceUrl);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;
      } catch (e) {
        console.error("오디오 로딩 중 에러 발생:", e);
      }
    };

    loadAudio();

    return () => {
      audioContext.close();
    };
  }, [sourceUrl]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectVolume;
    }
  }, [effectVolume]);

  const playSound = useCallback(() => {
    if (
      audioContextRef.current &&
      audioBufferRef.current &&
      gainNodeRef.current
    ) {
      const trackSource = audioContextRef.current.createBufferSource();
      trackSource.buffer = audioBufferRef.current;

      trackSource.connect(gainNodeRef.current);

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      trackSource.start();
    }
  }, []);

  return playSound;
};
