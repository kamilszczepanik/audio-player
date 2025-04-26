'use client';

import { useState, useEffect, useRef } from 'react';
import Multitrack from 'wavesurfer-multitrack';
import { Plus, Music, Play, Pause, Volume2, Search, SkipBack, SkipForward } from 'lucide-react';
import type { default as MultitrackInstance } from 'wavesurfer-multitrack';

// Types
interface AudioTrack {
  id: string;
  file: File;
  url: string;
}

interface WaveformOptions {
  waveColor: string;
  progressColor: string;
  cursorColor: string;
  barWidth: number;
  barRadius: number;
  cursorWidth: number;
  height: number;
}

interface MultitrackOptions {
  minPxPerSec: number;
  cursorWidth: number;
  cursorColor: string;
  trackBackground: string;
  trackBorderColor: string;
  dragBounds: boolean;
}

// Constants
const SUPPORTED_AUDIO_FORMATS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

const WAVEFORM_OPTIONS: WaveformOptions = {
  waveColor: '#4F46E5',
  progressColor: '#7C3AED',
  cursorColor: '#7C3AED',
  barWidth: 2,
  barRadius: 3,
  cursorWidth: 1,
  height: 100,
};

const MULTITRACK_OPTIONS: MultitrackOptions = {
  minPxPerSec: 5,
  cursorWidth: 2,
  cursorColor: '#D72F21',
  trackBackground: 'white',
  trackBorderColor: '#7C7C7C',
  dragBounds: true,
};

const SKIP_TIME_SECONDS = 30;

export default function AudioPlayer() {
  // State
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(MULTITRACK_OPTIONS.minPxPerSec);
  const [canPlay, setCanPlay] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultitrackInstance | null>(null);

  // Effects
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
  }, [canPlay, isPlaying]);

  useEffect(() => {
    if (!containerRef.current || tracks.length === 0) return;

    const multitrack = Multitrack.create(
      tracks.map((track, index) => ({
        id: index,
        draggable: true,
        startPosition: 0,
        url: track.url,
        volume,
        options: WAVEFORM_OPTIONS,
      })),
      {
        container: containerRef.current,
        ...MULTITRACK_OPTIONS,
        minPxPerSec: zoom,
      }
    );

    multitrack.once('canplay', () => setCanPlay(true));
    multitrackRef.current = multitrack;

    return () => multitrack.destroy();
  }, [tracks, volume, zoom]);

  // Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks = Array.from(files)
      .filter((file) => SUPPORTED_AUDIO_FORMATS[file.type])
      .map((file) => ({
        id: Math.random().toString(36),
        file,
        url: URL.createObjectURL(file),
      }));

    setTracks((prevTracks) => [...prevTracks, ...newTracks]);
  };

  const handlePlayPause = () => {
    if (!multitrackRef.current) return;

    if (isPlaying) {
      multitrackRef.current.pause();
    } else {
      multitrackRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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

  const handleSkipForward = () => {
    if (!multitrackRef.current) return;

    const currentTime = multitrackRef.current.getCurrentTime();
    multitrackRef.current.setTime(currentTime + SKIP_TIME_SECONDS);
  };

  const handleSkipBackward = () => {
    if (!multitrackRef.current) return;
    
    const currentTime = multitrackRef.current.getCurrentTime();
    multitrackRef.current.setTime(currentTime - SKIP_TIME_SECONDS);
  };

  // Render helpers
  const renderAudioControls = () => (
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

  const renderFileUpload = () => (
    <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer hover:border-gray-400 transition-colors">
      <div className="flex flex-col items-center justify-center text-center p-6">
        <p className="text-2xl font-medium text-gray-400 animate-pulse">Drop your audio files</p>
        <p className="text-lg text-gray-400 animate-pulse">or</p>
        <p className="text-2xl font-medium text-gray-400 animate-pulse">Click here to upload audio</p>
        <p className="mt-4 text-sm text-gray-400">
          Supported formats: {Object.values(SUPPORTED_AUDIO_FORMATS).join(', ')}
        </p>
      </div>
      <input
        type="file"
        accept={Object.keys(SUPPORTED_AUDIO_FORMATS)
          .map((type) => `.${SUPPORTED_AUDIO_FORMATS[type]}`)
          .join(',')}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );

  const renderAddMoreTracks = () => (
    <label className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-fit">
      <Plus className="w-4 h-4" />
      <span>Add more tracks</span>
      <input
        type="file"
        accept={Object.keys(SUPPORTED_AUDIO_FORMATS)
          .map((type) => `.${SUPPORTED_AUDIO_FORMATS[type]}`)
          .join(',')}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-4xl flex items-center justify-between relative">
        <div className="flex items-center gap-2 w-40">
          <Music className="w-6 h-6 text-violet-500" />
        </div>
        <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">iAudio</h1>
        <div className={`${tracks.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {renderAudioControls()}
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div className="flex flex-col gap-4 w-full">
          {tracks.length === 0 ? (
            renderFileUpload()
          ) : (
            <>
              <div ref={containerRef} className="w-full" />
              {renderAddMoreTracks()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
