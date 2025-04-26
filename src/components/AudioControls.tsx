import { useAudioControls } from '@/hooks/useAudioControls';
import { AudioTrack } from '@/types';
import { Pause, Play, Search, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import type { default as MultitrackInstance } from 'wavesurfer-multitrack';

interface Props {
  multitrackRef: React.RefObject<MultitrackInstance | null>;
  canPlay: boolean;
  setVolume: (volume: number) => void;
  setZoom: (zoom: number) => void;
  volume: number;
  zoom: number;
  tracks: AudioTrack[];
}

export const AudioControls = ({ multitrackRef, tracks, canPlay, setVolume, setZoom, volume, zoom }: Props) => {
  const { handleVolumeChange, handleZoomChange, handlePlayPause, isPlaying, handleSkipForward, handleSkipBackward } =
    useAudioControls({ canPlay, multitrackRef, tracks, setVolume, setZoom });

  return (
    <div className="flex items-center gap-6 transition-opacity duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <input type="range" min="10" max="100" value={zoom} onChange={handleZoomChange} className="w-24" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSkipBackward}
          disabled={!canPlay}
          className="p-2 rounded-lg hover:bg-violet-100 transition-colors"
          aria-label="Skip backward"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={handlePlayPause}
          disabled={!canPlay}
          className="p-4 rounded-lg bg-violet-300 transition-colors hover:scale-110 hover:cursor-pointer"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={handleSkipForward}
          disabled={!canPlay}
          className="p-2 rounded-lg hover:bg-violet-100 transition-colors"
          aria-label="Skip forward"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
