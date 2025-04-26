import { SUPPORTED_AUDIO_FORMATS } from '@/constants';
import { Plus } from 'lucide-react';

interface Props {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddMoreTracks = ({ handleFileUpload }: Props) => (
  <label className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors w-fit">
    <Plus className="w-4 h-4" />
    <span>Add more tracks</span>
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
