
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isSoundEnabled, toggleSound }) => {
  return (
    <button
      onClick={toggleSound}
      className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-md ml-2"
      aria-label={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
    >
      {isSoundEnabled ? (
        <Volume2 className="h-5 w-5 text-kawaii-blue-dark" />
      ) : (
        <VolumeX className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );
};

export default SoundToggle;
