'use client';

import { Music } from 'lucide-react';
import { AudioControls } from '@/components/AudioControls';
import { AddMoreTracks } from '@/components/AddMoreTracks';
import { FileUpload } from '@/components/FileUpload';
import { useMultitrack } from '@/hooks/useMultitrack';
import { useFileUpload } from '@/hooks/useFileUpload';

export default function AudioPlayer() {
  const { tracks, containerRef, volume, setVolume, zoom, setZoom, canPlay, setTracks, multitrackRef } = useMultitrack();
  const { handleFileUpload } = useFileUpload({ setTracks });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-3xl flex items-center justify-between relative">
        <div className="flex items-center gap-2 w-40">
          <Music className="w-6 h-6 text-violet-500" />
        </div>
        <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">iAudio</h1>
        <div className={`${tracks.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <AudioControls
            multitrackRef={multitrackRef}
            tracks={tracks}
            canPlay={canPlay}
            setVolume={setVolume}
            setZoom={setZoom}
            volume={volume}
            zoom={zoom}
          />
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-3xl">
        <div className="flex flex-col gap-4 w-full">
          {tracks.length === 0 ? (
            <FileUpload handleFileUpload={handleFileUpload} />
          ) : (
            <>
              <div ref={containerRef} className="w-full" />
              <AddMoreTracks handleFileUpload={handleFileUpload} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
