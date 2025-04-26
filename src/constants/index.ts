import { MultitrackOptions, WaveformOptions } from '@/types';

export const SUPPORTED_AUDIO_FORMATS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

export const WAVEFORM_OPTIONS: WaveformOptions = {
  waveColor: '#4F46E5',
  progressColor: '#7C3AED',
  cursorColor: '#7C3AED',
  barWidth: 2,
  barRadius: 3,
  cursorWidth: 1,
  height: 100,
};

export const MULTITRACK_OPTIONS: MultitrackOptions = {
  minPxPerSec: 5,
  cursorWidth: 2,
  cursorColor: '#D72F21',
  trackBackground: 'transparent',
  trackBorderColor: '#7C7C7C',
  dragBounds: false,
};

export const SKIP_TIME_SECONDS = 30;
