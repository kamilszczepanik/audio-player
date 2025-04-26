'use client';

import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Trash2 } from 'lucide-react';

const AUDIO_FORMATS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [howls, setHowls] = useState<Howl[]>([]);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAudioFiles = Array.from(files).filter((file) => AUDIO_FORMATS[file.type]);
      setAudioFiles((prev) => [...prev, ...newAudioFiles]);
    }
  };

  useEffect(() => {
    howls.forEach((h) => h.unload());
    blobUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    if (audioFiles.length === 0) {
      setHowls([]);
      setBlobUrls([]);
      return;
    }
    const newBlobUrls: string[] = [];
    const newHowls = audioFiles.map((file) => {
      const url = URL.createObjectURL(file);
      newBlobUrls.push(url);

      return new Howl({
        src: [url],
        format: [AUDIO_FORMATS[file.type]],
        volume,
        onend: function () {
          // Optionally handle end event
        },
      });
    });
    setHowls(newHowls);
    setBlobUrls(newBlobUrls);
    setIsPlaying(false);
    return () => {
      newHowls.forEach((h) => h.unload());
      newBlobUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFiles]);

  const handlePlayPause = () => {
    if (howls.length === 0) return;
    if (isPlaying) {
      howls.forEach((h) => h.pause());
      setIsPlaying(false);
    } else {
      howls.forEach((h) => h.play());
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    howls.forEach((h) => h.volume(newVolume));
  };

  const handleDeleteTrack = (index: number) => {
    // Clean up the howl and blob URL for the deleted track
    if (howls[index]) {
      howls[index].unload();
    }
    if (blobUrls[index]) {
      URL.revokeObjectURL(blobUrls[index]);
    }

    // Remove the track from all state arrays
    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
    setHowls((prev) => prev.filter((_, i) => i !== index));
    setBlobUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Audio Pill Player</h1>
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept={Object.keys(AUDIO_FORMATS)
              .map((type) => `.${AUDIO_FORMATS[type]}`)
              .join(',')}
            multiple
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          {audioFiles.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
              <ul className="space-y-2">
                {audioFiles.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                    <span>{file.name}</span>
                    <button
                      onClick={() => handleDeleteTrack(index)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      aria-label="Delete track"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  disabled={howls.length === 0}
                  className="px-3 py-1 bg-violet-500 text-white rounded disabled:bg-gray-300"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <label className="flex items-center gap-2">
                  Volume
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-32"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">footer</footer>
    </div>
  );
}
