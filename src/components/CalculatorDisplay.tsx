
import React, { useEffect, useRef } from 'react';
import { formatDisplayValue } from '@/utils/calculatorUtils';

interface CalculatorDisplayProps {
  input: string;
  result: string;
  onInputPaste?: (pastedText: string) => void;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ 
  input, 
  result,
  onInputPaste 
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  
  // Enable paste functionality
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData('text') || '';
      
      if (pastedText && onInputPaste) {
        // Filter to only allow valid calculator characters
        const filteredText = pastedText.replace(/[^0-9+\-*/().%^πe]/g, '');
        onInputPaste(filteredText);
      }
    };
    
    const element = inputRef.current;
    if (element) {
      element.addEventListener('paste', handlePaste);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('paste', handlePaste);
      }
    };
  }, [onInputPaste]);
  
  return (
    <div className="kawaii-display relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1 left-2 flex space-x-1.5">
        <div className="h-2 w-2 rounded-full bg-kawaii-pink-dark opacity-60"></div>
        <div className="h-2 w-2 rounded-full bg-kawaii-yellow-dark opacity-60"></div>
        <div className="h-2 w-2 rounded-full bg-kawaii-mint-dark opacity-60"></div>
      </div>
      
      <div className="flex flex-col h-full">
        {/* Input Display (Formula) */}
        <div 
          ref={inputRef}
          className="text-base text-foreground/70 min-h-[1.5rem] break-all text-right mb-1 cursor-text" 
          contentEditable={true}
          onInput={(e) => {
            // Prevent direct input changes
            e.preventDefault();
            (e.target as HTMLElement).textContent = formatDisplayValue(input) || '0';
          }}
          onCut={(e) => e.preventDefault()}
          tabIndex={0}
          title="Click to paste formula (Ctrl+V)"
        >
          {formatDisplayValue(input) || '0'}
        </div>
        
        {/* Result Display */}
        <div className="text-3xl font-bold text-foreground min-h-[2rem] break-all text-right">
          {result || '0'}
        </div>
      </div>
    </div>
  );
};

export default CalculatorDisplay;
