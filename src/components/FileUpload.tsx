import { SUPPORTED_AUDIO_FORMATS } from '@/constants';

interface Props {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload = ({ handleFileUpload }: Props) => {
  return (
    <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer hover:border-gray-400 transition-colors">
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
