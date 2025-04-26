'use client';

import { useState, useEffect, useRef } from 'react';
import Multitrack from 'wavesurfer-multitrack';
import { Plus, Music, Play, Pause, Volume2, Search, SkipBack, SkipForward } from 'lucide-react';

const AUDIO_FORMATS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

type Track = {
  id: string;
  file: File;
};

type MultitrackInstance = {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
  setTime: (time: number) => void;
  getCurrentTime: () => number;
  zoom: (value: number) => void;
  destroy: () => void;
  on: (event: string, callback: (data: any) => void) => void;
  once: (event: string, callback: () => void) => void;
};

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(5);
  const [canPlay, setCanPlay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultitrackInstance | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAudioFiles = Array.from(files).filter((file) => AUDIO_FORMATS[file.type]);
      newAudioFiles.forEach((file) => {
        const track: Track = {
          id: Math.random().toString(36).substr(2, 9),
          file,
        };
        setTracks((prev) => [...prev, track]);
      });
    }
  };

  useEffect(() => {
    if (containerRef.current && tracks.length > 0) {
      const multitrack = Multitrack.create(
        tracks.map((track, index) => ({
          id: index,
          draggable: true,
          startPosition: 0,
          url: URL.createObjectURL(track.file),
          volume: volume,
          options: {
            waveColor: '#4F46E5',
            progressColor: '#7C3AED',
            cursorColor: '#7C3AED',
            barWidth: 2,
            barRadius: 3,
            cursorWidth: 1,
            height: 100,
          },
        })),
        {
          container: containerRef.current,
          minPxPerSec: zoom,
          cursorWidth: 2,
          cursorColor: '#D72F21',
          trackBackground: '#2D2D2D',
          trackBorderColor: '#7C7C7C',
          dragBounds: true,
        }
      );

      multitrack.once('canplay', () => {
        setCanPlay(true);
      });

      multitrack.on('start-position-change', ({ id, startPosition }) => {
        console.log(`Track ${id} start position updated to ${startPosition}`);
      });

      multitrack.on('volume-change', ({ id, volume }) => {
        console.log(`Track ${id} volume updated to ${volume}`);
      });

      multitrackRef.current = multitrack as unknown as MultitrackInstance;

      return () => {
        multitrack.destroy();
      };
    }
  }, [tracks]);

  const handlePlayPause = () => {
    if (multitrackRef.current) {
      if (isPlaying) {
        multitrackRef.current.pause();
        setIsPlaying(false);
      } else {
        multitrackRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (multitrackRef.current) {
      // Update volume for all tracks
      tracks.forEach((_, index) => {
        // @ts-expect-error - The API has this method but TypeScript doesn't know about it
        multitrackRef.current?.setTrackVolume(index, newVolume);
      });
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(e.target.value);
    setZoom(newZoom);
    if (multitrackRef.current) {
      multitrackRef.current.zoom(newZoom);
    }
  };

  const handleSkipForward = () => {
    if (multitrackRef.current) {
      multitrackRef.current.setTime(multitrackRef.current.getCurrentTime() + 30);
    }
  };

  const handleSkipBackward = () => {
    if (multitrackRef.current) {
      multitrackRef.current.setTime(multitrackRef.current.getCurrentTime() - 30);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 w-40">
          <Music className="w-6 h-6 text-violet-500" />
        </div>
        <h1 className="text-2xl font-bold text-center">iAudio</h1>
        <div
          className={`flex items-center gap-6 transition-opacity duration-300 ${tracks.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
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
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div className="flex flex-col gap-4 w-full">
          {tracks.length === 0 ? (
            <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center justify-center text-center p-6">
                <p className="text-2xl font-medium text-gray-400 animate-pulse">Drop your audio files</p>
                <p className="text-lg text-gray-400 animate-pulse">or</p>
                <p className="text-2xl font-medium text-gray-400 animate-pulse">Click here to upload audio</p>
                <p className="mt-4 text-sm text-gray-400 ">Supported formats: mp3, wav, ogg, flac</p>
              </div>
              <input
                type="file"
                accept={Object.keys(AUDIO_FORMATS)
                  .map((type) => `.${AUDIO_FORMATS[type]}`)
                  .join(',')}
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <>
              <div ref={containerRef} className="w-full" />
              <label className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-fit">
                <Plus className="w-4 h-4" />
                <span>Add more tracks</span>
                <input
                  type="file"
                  accept={Object.keys(AUDIO_FORMATS)
                    .map((type) => `.${AUDIO_FORMATS[type]}`)
                    .join(',')}
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
