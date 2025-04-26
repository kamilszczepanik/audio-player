import { SUPPORTED_AUDIO_FORMATS } from '@/constants';
import { useState } from 'react';

interface Props {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload = ({ handleFileUpload }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    const fakeEvent = {
      target: {
        files: files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleFileUpload(fakeEvent);
  };

  return (
    <label
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-colors ${
        isDragging ? 'border-violet-400 bg-violet-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center p-6">
        <p className="text-2xl font-medium text-gray-400 animate-pulse">Drop your audio files</p>
        <p className="text-lg text-gray-400 animate-pulse">or</p>
        <p className="text-2xl font-medium text-gray-400 animate-pulse">Click here to upload audio</p>
        <p className="mt-4 text-sm text-gray-400">
          Supported formats: {Object.values(SUPPORTED_AUDIO_FORMATS).join(', ')}
        </p>
      </div>
      <input
        type="file"
        accept={Object.keys(SUPPORTED_AUDIO_FORMATS)
          .map((type) => `.${SUPPORTED_AUDIO_FORMATS[type]}`)
          .join(',')}
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );
};
