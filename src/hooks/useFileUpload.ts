import { SUPPORTED_AUDIO_FORMATS } from '@/constants';
import { AudioTrack } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setTracks: Dispatch<SetStateAction<AudioTrack[]>>;
}

export const useFileUpload = ({ setTracks }: Props) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks = Array.from(files)
      .filter((file) => SUPPORTED_AUDIO_FORMATS[file.type])
      .map((file) => ({
        id: Math.random().toString(36),
        file,
        url: URL.createObjectURL(file),
      }));

    setTracks((prevTracks) => [...prevTracks, ...newTracks]);
  };

  return { handleFileUpload };
};
