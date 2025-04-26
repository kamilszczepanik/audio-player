"use client";

import { useState } from "react";

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAudioFiles = Array.from(files).filter(
        (file) => file.type === "audio/mpeg" || file.type === "audio/wav"
      );
      setAudioFiles((prev) => [...prev, ...newAudioFiles]);
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
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
              <ul className="space-y-2">
                {audioFiles.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
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
