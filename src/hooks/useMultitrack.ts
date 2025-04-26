import { useState, useEffect, useRef } from 'react';
import Multitrack from 'wavesurfer-multitrack';
import { AudioTrack } from '@/types';
import { MULTITRACK_OPTIONS, WAVEFORM_OPTIONS } from '@/constants';
import type { default as MultitrackInstance } from 'wavesurfer-multitrack';

export const useMultitrack = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [volume, setVolume] = useState(1);
  const [zoom, setZoom] = useState(MULTITRACK_OPTIONS.minPxPerSec);
  const [canPlay, setCanPlay] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultitrackInstance | null>(null);

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
  }, [tracks]); // eslint-disable-line react-hooks/exhaustive-deps

  return { tracks, containerRef, volume, setVolume, zoom, setZoom, canPlay, setTracks, multitrackRef };
};
