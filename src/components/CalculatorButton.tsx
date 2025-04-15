
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'equals' 
  | 'clear'
  | 'memory';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  variant?: ButtonVariant;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  label?: React.ReactNode;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  variant = 'number',
  className,
  colSpan = 1,
  rowSpan = 1,
  label,
}) => {
  const handleClick = () => {
    onClick(value);
  };

  const variantClasses = {
    number: 'btn-number',
    operator: 'btn-operator',
    function: 'btn-function',
    equals: 'btn-equals',
    clear: 'btn-clear',
    memory: 'btn-function',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        variantClasses[variant],
        'relative select-none h-12 md:h-14 font-medium text-lg animate-pop',
        className,
        {
          'col-span-2': colSpan === 2,
          'col-span-3': colSpan === 3,
          'row-span-2': rowSpan === 2,
          'row-span-3': rowSpan === 3,
        }
      )}
    >
      {/* Optional small decorative element for kawaii style */}
      {variant === 'equals' && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-kawaii-mint animate-pulse-soft rounded-full"></span>
      )}
      {variant === 'clear' && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-kawaii-peach-dark animate-pulse-soft rounded-full"></span>
      )}
      {variant === 'function' && (
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-kawaii-purple-dark/50 rounded-full"></span>
      )}
      
      {/* Button Label */}
      {label || value}
    </button>
  );
};

export default CalculatorButton;
