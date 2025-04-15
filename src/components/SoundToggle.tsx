
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playToggleSound } from '@/utils/soundUtils';

interface SoundToggleProps {
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isSoundEnabled, toggleSound }) => {
  const handleToggle = () => {
    // Play toggle sound if sound is currently enabled (before toggle)
    if (isSoundEnabled) {
      playToggleSound(true);
    }
    
    // Call the actual toggle function with slight delay to hear the sound
    setTimeout(() => {
      toggleSound();
    }, 50);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-md ml-2"
      aria-label={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
      title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
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
