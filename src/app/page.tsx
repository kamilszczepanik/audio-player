'use client';

import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Trash2, Plus, Music, Play, Pause, Volume2 } from 'lucide-react';

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
    if (howls[index]) {
      howls[index].unload();
    }
    if (blobUrls[index]) {
      URL.revokeObjectURL(blobUrls[index]);
    }

    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
    setHowls((prev) => prev.filter((_, i) => i !== index));
    setBlobUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 w-40">
          <Music className="w-6 h-6 text-violet-500" />
        </div>
        <h1 className="text-2xl font-bold text-center">iAudio</h1>
        <div
          className={`flex items-center gap-4 transition-opacity duration-300 ${audioFiles.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <button
            onClick={handlePlayPause}
            disabled={howls.length === 0}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
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
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        <div className="flex flex-col gap-4 w-full">
          {audioFiles.length === 0 ? (
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
