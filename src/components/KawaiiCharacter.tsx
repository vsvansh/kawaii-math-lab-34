
import React from 'react';

interface KawaiiCharacterProps {
  variant?: 'happy' | 'curious' | 'sleepy' | 'excited';
  className?: string;
}

const KawaiiCharacter: React.FC<KawaiiCharacterProps> = ({ 
  variant = 'happy',
  className = ''
}) => {
  // Different expressions based on variant
  const getEyes = () => {
    switch (variant) {
      case 'happy':
        return (
          <>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </>
        );
      case 'curious':
        return (
          <>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-4 bg-black rounded-full"></div>
          </>
        );
      case 'sleepy':
        return (
          <>
            <div className="w-3 h-0.5 bg-black rounded-full mt-1.5"></div>
            <div className="w-3 h-0.5 bg-black rounded-full mt-1.5"></div>
          </>
        );
      case 'excited':
        return (
          <>
            <div className="w-3 h-3 bg-black rounded-full relative">
              <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="w-3 h-3 bg-black rounded-full relative">
              <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </>
        );
    }
  };

  const getMouth = () => {
    switch (variant) {
      case 'happy':
        return <div className="w-4 h-2 bg-black rounded-b-full"></div>;
      case 'curious':
        return <div className="w-2 h-2 bg-black rounded-full"></div>;
      case 'sleepy':
        return <div className="w-3 h-3 bg-black rounded-full opacity-50"></div>;
      case 'excited':
        return <div className="w-5 h-3 bg-black rounded-full"></div>;
      default:
        return <div className="w-4 h-2 bg-black rounded-b-full"></div>;
    }
  };

  const getBlush = () => {
    if (variant === 'excited' || variant === 'happy') {
      return (
        <>
          <div className="absolute -bottom-1 -left-3 w-3 h-2 bg-kawaii-pink-dark opacity-40 rounded-full"></div>
          <div className="absolute -bottom-1 -right-3 w-3 h-2 bg-kawaii-pink-dark opacity-40 rounded-full"></div>
        </>
      );
    }
    return null;
  };

  // Base animation based on variant
  const getAnimation = () => {
    switch (variant) {
      case 'happy':
        return 'animate-bounce-small';
      case 'curious':
        return 'animate-wiggle';
      case 'sleepy':
        return 'animate-pulse-soft';
      case 'excited':
        return 'animate-bounce';
      default:
        return 'animate-bounce-small';
    }
  };

  return (
    <div className={`relative ${className} ${getAnimation()}`}>
      {/* Character head */}
      <div className="w-14 h-14 bg-kawaii-yellow-light rounded-full border-2 border-kawaii-yellow flex flex-col justify-center items-center relative">
        {/* Eyes */}
        <div className="flex space-x-2 items-center mb-1">
          {getEyes()}
        </div>
        
        {/* Mouth */}
        <div className="mt-1 flex justify-center">
          {getMouth()}
        </div>
        
        {/* Blush */}
        {getBlush()}
      </div>
      
      {/* Optional decorative elements */}
      {variant === 'happy' && (
        <div className="absolute -top-2 -right-1 w-4 h-4 bg-kawaii-pink-light rounded-full border border-kawaii-pink"></div>
      )}
      {variant === 'excited' && (
        <div className="absolute -top-3 left-5 w-2 h-6 bg-kawaii-purple-light border border-kawaii-purple rounded-full transform rotate-12"></div>
      )}
    </div>
  );
};

export default KawaiiCharacter;
