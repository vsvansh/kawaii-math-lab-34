
import React from 'react';
import { formatDisplayValue } from '@/utils/calculatorUtils';

interface CalculatorDisplayProps {
  input: string;
  result: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ input, result }) => {
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
        <div className="text-base text-foreground/70 min-h-[1.5rem] break-all text-right mb-1">
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
