
// Audio API utilities for sound effects
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

export const playModeChangeSound = (isSoundEnabled: boolean): void => {
  if (!isSoundEnabled || !audioContext) return;
  
  try {
    // Create oscillator for a more melodic sound on mode change
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator for a sweet transition sound
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(330, audioContext.currentTime); // E4 note
    oscillator.frequency.linearRampToValueAtTime(660, audioContext.currentTime + 0.15); // E5
    oscillator.frequency.linearRampToValueAtTime(495, audioContext.currentTime + 0.3); // B4
    
    // Configure gain (volume and fade out)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    // Connect and start
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.error("Error playing mode change sound:", error);
  }
};

export const playToggleSound = (isSoundEnabled: boolean): void => {
  if (!isSoundEnabled || !audioContext) return;
  
  try {
    // Create oscillator for a toggle switch sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator for a cute toggle sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    // Configure gain
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    // Connect and start
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.error("Error playing toggle sound:", error);
  }
};
