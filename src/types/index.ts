export interface AudioTrack {
  id: string;
  file: File;
  url: string;
}

export interface WaveformOptions {
  waveColor: string;
  progressColor: string;
  cursorColor: string;
  barWidth: number;
  barRadius: number;
  cursorWidth: number;
  height: number;
}

export interface MultitrackOptions {
  minPxPerSec: number;
  cursorWidth: number;
  cursorColor: string;
  trackBackground: string;
  trackBorderColor: string;
  dragBounds: boolean;
}
