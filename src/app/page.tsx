'use client';

import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Trash2, Plus, Music, Play, Pause, Volume2, Search } from 'lucide-react';

const AUDIO_FORMATS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

type Track = {
  id: string;
  file: File;
  wavesurfer: WaveSurfer | null;
  container: HTMLDivElement | null;
};

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(10);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAudioFiles = Array.from(files).filter((file) => AUDIO_FORMATS[file.type]);
      newAudioFiles.forEach((file) => {
        const track: Track = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          wavesurfer: null,
          container: null,
        };
        setTracks((prev) => [...prev, track]);
      });
    }
  };

  useEffect(() => {
    tracks.forEach((track) => {
      if (!track.wavesurfer) {
        const container = document.getElementById(`waveform-${track.id}`);
        if (container) {
          const wavesurfer = WaveSurfer.create({
            container: container,
            waveColor: '#4F46E5',
            progressColor: '#7C3AED',
            cursorColor: '#7C3AED',
            barWidth: 2,
            barRadius: 3,
            cursorWidth: 1,
            height: 100,
          });

          const url = URL.createObjectURL(track.file);
          wavesurfer.load(url);

          wavesurfer.on('ready', () => {
            setDuration(Math.max(duration, wavesurfer.getDuration()));
          });

          wavesurfer.on('audioprocess', (time) => {
            setCurrentTime(time);
          });

          wavesurfer.on('interaction', () => {
            const currentTime = wavesurfer.getCurrentTime();
            tracks.forEach((otherTrack) => {
              if (otherTrack.id !== track.id && otherTrack.wavesurfer) {
                otherTrack.wavesurfer.seekTo(currentTime / otherTrack.wavesurfer.getDuration());
              }
            });
          });

          track.wavesurfer = wavesurfer;
        }
      }
    });

    return () => {
      tracks.forEach((track) => {
        if (track.wavesurfer) {
          track.wavesurfer.destroy();
        }
      });
    };
  }, [tracks]);

  const handlePlayPause = () => {
    if (tracks.length === 0) return;

    if (isPlaying) {
      tracks.forEach((track) => track.wavesurfer?.pause());
      setIsPlaying(false);
    } else {
      tracks.forEach((track) => track.wavesurfer?.play());
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    tracks.forEach((track) => track.wavesurfer?.setVolume(newVolume));
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks((prev) => {
      const track = prev.find((t) => t.id === trackId);
      if (track) {
        if (track.wavesurfer) {
          track.wavesurfer.destroy();
        }
        if (track.container) {
          track.container.remove();
        }
      }
      return prev.filter((t) => t.id !== trackId);
    });
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseInt(e.target.value);
    setZoom(newZoom);
    tracks.forEach((track) => {
      if (track.wavesurfer) {
        track.wavesurfer.zoom(newZoom);
      }
    });
  };

  useEffect(() => {
    if (playheadRef.current) {
      const percentage = (currentTime / duration) * 100;
      playheadRef.current.style.left = `${percentage}%`;
    }
  }, [currentTime, duration]);

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
          <button
            onClick={handlePlayPause}
            disabled={tracks.length === 0}
            className="p-4 rounded-lg bg-violet-300 transition-colors hover:scale-110 hover:cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
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
              <div className="relative w-full" ref={timelineRef}>
                <div
                  ref={playheadRef}
                  className="absolute top-0 bottom-0 w-0.5 bg-violet-500 z-10"
                  style={{ left: '0%' }}
                />
                {tracks.map((track) => (
                  <div key={track.id} className="relative mb-4">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Delete track"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <div id={`waveform-${track.id}`} />
                      <span className="text-sm text-gray-600 mt-2">{track.file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
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
