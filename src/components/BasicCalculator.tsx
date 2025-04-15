
import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import MemoryPanel from './MemoryPanel';
import { evaluateExpression, formatDisplayValue } from '@/utils/calculatorUtils';

interface BasicCalculatorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  addToHistory: (input: string, result: string) => void;
  memory?: string | null;
  setMemory?: React.Dispatch<React.SetStateAction<string | null>>;
  isSoundEnabled: boolean;
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({ 
  input, 
  setInput, 
  result, 
  setResult, 
  addToHistory,
  memory: externalMemory,
  setMemory: setExternalMemory,
  isSoundEnabled
}) => {
  // Use local memory state if external is not provided
  const [localMemory, setLocalMemory] = useState<string | null>(null);
  
  // Use either external or local memory state
  const memoryValue = externalMemory !== undefined ? externalMemory : localMemory;
  const setMemoryValue = setExternalMemory || setLocalMemory;

  const handleButtonClick = (value: string) => {
    switch (value) {
      case '=':
        calculateResult();
        break;
      case 'C':
        clearInput();
        break;
      case '⌫':
        backspace();
        break;
      case '±':
        toggleSign();
        break;
      default:
        appendInput(value);
    }
  };

  const calculateResult = () => {
    try {
      if (input) {
        const calculatedResult = evaluateExpression(input);
        if (calculatedResult !== "Error") {
          setResult(calculatedResult);
          addToHistory(input, calculatedResult);
        } else {
          setResult("Error");
        }
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const backspace = () => {
    setInput(prevInput => prevInput.slice(0, -1));
  };

  const toggleSign = () => {
    if (input === '') return;
    
    // If input starts with a minus, remove it
    if (input.startsWith('-')) {
      setInput(input.substring(1));
    } else {
      // Otherwise add a minus at the beginning
      setInput('-' + input);
    }
  };

  const appendInput = (value: string) => {
    setInput(prevInput => {
      // Replace operators if one is already present at the end
      const operators = ['+', '-', '*', '/', '.'];
      const lastChar = prevInput.slice(-1);
      
      if (operators.includes(value) && operators.includes(lastChar)) {
        return prevInput.slice(0, -1) + value;
      }
      
      // Format display value for preview calculation
      const newInput = prevInput + value;
      try {
        const preview = evaluateExpression(newInput);
        if (preview !== "Error") {
          setResult(preview);
        }
      } catch {
        // Ignore calculation errors during input
      }
      
      return newInput;
    });
  };

  // Memory functions
  const handleMemoryRecall = () => {
    if (memoryValue) {
      setInput(prevInput => prevInput + memoryValue);
    }
  };

  const handleMemoryClear = () => {
    setMemoryValue(null);
  };

  const handleMemoryAdd = () => {
    try {
      const currentValue = result ? parseFloat(result) : 0;
      const currentMemory = memoryValue ? parseFloat(memoryValue) : 0;
      setMemoryValue((currentMemory + currentValue).toString());
    } catch (error) {
      console.error("Memory addition error:", error);
    }
  };

  const handleMemorySubtract = () => {
    try {
      const currentValue = result ? parseFloat(result) : 0;
      const currentMemory = memoryValue ? parseFloat(memoryValue) : 0;
      setMemoryValue((currentMemory - currentValue).toString());
    } catch (error) {
      console.error("Memory subtraction error:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <CalculatorDisplay input={input} result={result} />
      
      <MemoryPanel
        memory={memoryValue}
        onMemoryRecall={handleMemoryRecall}
        onMemoryClear={handleMemoryClear}
        onMemoryAdd={handleMemoryAdd}
        onMemorySubtract={handleMemorySubtract}
      />
      
      <div className="grid grid-cols-4 gap-2 mt-2">
        {/* Row 1 */}
        <CalculatorButton value="C" onClick={handleButtonClick} variant="clear" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="%" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="±" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="/" onClick={handleButtonClick} variant="operator" label="÷" isSoundEnabled={isSoundEnabled} />
        
        {/* Row 2 */}
        <CalculatorButton value="7" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="8" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="9" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="*" onClick={handleButtonClick} variant="operator" label="×" isSoundEnabled={isSoundEnabled} />
        
        {/* Row 3 */}
        <CalculatorButton value="4" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="5" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="6" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="-" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />
        
        {/* Row 4 */}
        <CalculatorButton value="1" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="2" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="3" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="+" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />
        
        {/* Row 5 */}
        <CalculatorButton value="0" onClick={handleButtonClick} colSpan={2} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="." onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="=" onClick={handleButtonClick} variant="equals" isSoundEnabled={isSoundEnabled} />
        
        {/* Row 6 */}
        <CalculatorButton value="(" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value=")" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="⌫" onClick={handleButtonClick} variant="clear" colSpan={2} isSoundEnabled={isSoundEnabled} />
      </div>
    </div>
  );
};

export default BasicCalculator;
