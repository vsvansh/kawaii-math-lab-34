import React, { useState, useRef, useEffect } from 'react';
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
  cursorPosition?: number | null;
  setCursorPosition?: React.Dispatch<React.SetStateAction<number | null>>;
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({ 
  input, 
  setInput, 
  result, 
  setResult, 
  addToHistory,
  memory: externalMemory,
  setMemory: setExternalMemory,
  isSoundEnabled,
  cursorPosition,
  setCursorPosition
}) => {
  const [localMemory, setLocalMemory] = useState<string | null>(null);
  
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
    
    if (input.startsWith('-')) {
      setInput(input.substring(1));
    } else {
      setInput('-' + input);
    }
  };

  const appendInput = (value: string) => {
    setInput(prevInput => {
      const operators = ['+', '-', '*', '/', '.'];
      const lastChar = prevInput.slice(-1);
      
      if (operators.includes(value) && operators.includes(lastChar)) {
        return prevInput.slice(0, -1) + value;
      }
      
      const newInput = prevInput + value;
      try {
        const preview = evaluateExpression(newInput);
        if (preview !== "Error") {
          setResult(preview);
        }
      } catch {
      }
      
      return newInput;
    });
  };

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

  const handleCalculatorPaste = (pastedText: string) => {
    if (pastedText) {
      setInput(prevInput => {
        if (cursorPosition !== null && setCursorPosition && cursorPosition <= prevInput.length) {
          const before = prevInput.substring(0, cursorPosition);
          const after = prevInput.substring(cursorPosition);
          setCursorPosition(cursorPosition + pastedText.length);
          return before + pastedText + after;
        } else {
          return prevInput + pastedText;
        }
      });
      
      try {
        const newInput = input + pastedText;
        const preview = evaluateExpression(newInput);
        if (preview !== "Error") {
          setResult(preview);
        }
      } catch {
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <CalculatorDisplay 
        input={input} 
        result={result} 
        onInputPaste={handleCalculatorPaste}
      />
      
      <MemoryPanel
        memory={memoryValue}
        onMemoryRecall={handleMemoryRecall}
        onMemoryClear={handleMemoryClear}
        onMemoryAdd={handleMemoryAdd}
        onMemorySubtract={handleMemorySubtract}
      />
      
      <div className="grid grid-cols-4 gap-2 mt-2">
        <CalculatorButton value="C" onClick={handleButtonClick} variant="clear" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="%" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="±" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="/" onClick={handleButtonClick} variant="operator" label="÷" isSoundEnabled={isSoundEnabled} />
        
        <CalculatorButton value="7" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="8" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="9" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="*" onClick={handleButtonClick} variant="operator" label="×" isSoundEnabled={isSoundEnabled} />
        
        <CalculatorButton value="4" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="5" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="6" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="-" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />
        
        <CalculatorButton value="1" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="2" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="3" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="+" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />
        
        <CalculatorButton value="0" onClick={handleButtonClick} colSpan={2} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="." onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="=" onClick={handleButtonClick} variant="equals" isSoundEnabled={isSoundEnabled} />
        
        <CalculatorButton value="(" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value=")" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="⌫" onClick={handleButtonClick} variant="clear" colSpan={2} isSoundEnabled={isSoundEnabled} />
      </div>
    </div>
  );
};

export default BasicCalculator;
