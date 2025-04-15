
// Button click sound - generated with Web Audio API for a cute "blip" sound
let audioContext: AudioContext | null = null;

export const initializeAudio = (): void => {
  // Initialize audio context on first user interaction
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error("Web Audio API is not supported in this browser.", error);
    }
  }
};

export const playButtonSound = (isSoundEnabled: boolean): void => {
  if (!isSoundEnabled || !audioContext) return;
  
  try {
    // Create oscillator for a cute blip sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator for kawaii sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // Slide up to A5
    
    // Configure gain (volume and fade out)
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    // Connect and start
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.error("Error playing button sound:", error);
  }
};
