import { SKIP_TIME_SECONDS } from '@/constants';
import { AudioTrack } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import type { default as MultitrackInstance } from 'wavesurfer-multitrack';

interface Props {
  canPlay: boolean;
  tracks: AudioTrack[];
  multitrackRef: React.RefObject<MultitrackInstance | null>;
  setVolume: (volume: number) => void;
  setZoom: (zoom: number) => void;
}
export const useAudioControls = ({ canPlay, multitrackRef, tracks, setVolume, setZoom }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (multitrackRef.current) {
      tracks.forEach((_, index) => {
        multitrackRef.current?.setTrackVolume(index, newVolume);
      });
    }
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(event.target.value);
    setZoom(newZoom);

    if (multitrackRef.current) {
      multitrackRef.current.zoom(newZoom);
    }
  };

  const handlePlayPause = useCallback(() => {
    if (!multitrackRef.current) return;

    if (isPlaying) {
      multitrackRef.current.pause();
    } else {
      multitrackRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, multitrackRef]);

  const handleSkipForward = useCallback(() => {
    if (!multitrackRef.current) return;

    const currentTime = multitrackRef.current.getCurrentTime();
    multitrackRef.current.setTime(currentTime + SKIP_TIME_SECONDS);
  }, [multitrackRef]);

  const handleSkipBackward = useCallback(() => {
    if (!multitrackRef.current) return;

    const currentTime = multitrackRef.current.getCurrentTime();
    multitrackRef.current.setTime(currentTime - SKIP_TIME_SECONDS);
  }, [multitrackRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canPlay) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          handleSkipBackward();
          break;
        case 'ArrowRight':
          handleSkipForward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canPlay, isPlaying, handlePlayPause, handleSkipBackward, handleSkipForward]);

  return { isPlaying, handleVolumeChange, handleZoomChange, handlePlayPause, handleSkipForward, handleSkipBackward };
};
