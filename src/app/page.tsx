"use client";

import { useState, useRef, useEffect } from "react";
import { Howl } from "howler";

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [howl, setHowl] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const howlRef = useRef<Howl | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAudioFiles = Array.from(files).filter(
        (file) => file.type === "audio/mpeg" || file.type === "audio/wav"
      );
      setAudioFiles((prev) => [...prev, ...newAudioFiles]);
    }
  };

  useEffect(() => {
    if (audioFiles.length === 0) return;
    const file = audioFiles[0];
    const url = URL.createObjectURL(file);
    if (howlRef.current) {
      howlRef.current.unload();
    }
    const sound = new Howl({
      src: [url],
      volume,
      format: ["mp3", "wav"],
      onend: function () {
        setIsPlaying(false);
      },
    });
    howlRef.current = sound;
    setHowl(sound);
    setIsPlaying(false);
    return () => {
      sound.unload();
      URL.revokeObjectURL(url);
    };
  }, [audioFiles]);

  const handlePlayPause = () => {
    if (!howl) return;
    if (isPlaying) {
      howl.pause();
      setIsPlaying(false);
    } else {
      howl.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (howl) {
      howl.volume(newVolume);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Audio Pill Player</h1>
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".mp3,.wav"
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
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  disabled={!howl}
                  className="px-3 py-1 bg-violet-500 text-white rounded disabled:bg-gray-300"
                >
                  {isPlaying ? "Pause" : "Play"}
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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        footer
      </footer>
    </div>
  );
}
