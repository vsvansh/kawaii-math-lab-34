
import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import MemoryPanel from './MemoryPanel';
import { 
  evaluateExpression, 
  calculateTrigFunction,
  calculateLogFunction,
  calculateFactorial
} from '@/utils/calculatorUtils';

interface ScientificCalculatorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  addToHistory: (input: string, result: string) => void;
  memory?: string | null;
  setMemory?: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ 
  input, 
  setInput, 
  result, 
  setResult, 
  addToHistory,
  memory: externalMemory,
  setMemory: setExternalMemory
}) => {
  const [inDegrees, setInDegrees] = useState(true);
  
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
      case 'sin':
      case 'cos':
      case 'tan':
      case 'sin⁻¹':
      case 'cos⁻¹':
      case 'tan⁻¹':
        appendTrigFunction(value);
        break;
      case 'log':
      case 'ln':
        appendLogFunction(value);
        break;
      case 'x²':
        appendSquare();
        break;
      case 'x³':
        appendCube();
        break;
      case '√':
        appendSquareRoot();
        break;
      case 'π':
      case 'e':
        appendConstant(value);
        break;
      case '!':
        appendFactorial();
        break;
      case 'xʸ':
        appendPower();
        break;
      case 'DEG/RAD':
        toggleAngleMode();
        break;
      case '|x|':
        appendAbsoluteValue();
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
        // Ignore calculation errors during input
      }
      
      return newInput;
    });
  };

  const appendTrigFunction = (func: string) => {
    setInput(prevInput => prevInput + `${func}(`);
  };

  const appendLogFunction = (func: string) => {
    setInput(prevInput => prevInput + `${func}(`);
  };

  const appendSquare = () => {
    setInput(prevInput => {
      // Try to evaluate the current input first
      try {
        const value = evaluateExpression(prevInput);
        if (value !== "Error") {
          return `(${prevInput})^2`;
        }
      } catch {}
      
      return prevInput + '^2';
    });
  };

  const appendCube = () => {
    setInput(prevInput => {
      try {
        const value = evaluateExpression(prevInput);
        if (value !== "Error") {
          return `(${prevInput})^3`;
        }
      } catch {}
      
      return prevInput + '^3';
    });
  };

  const appendSquareRoot = () => {
    setInput(prevInput => prevInput + 'sqrt(');
  };

  const appendConstant = (constant: string) => {
    setInput(prevInput => prevInput + constant);
  };

  const appendFactorial = () => {
    setInput(prevInput => {
      try {
        // Check if we need to wrap the current input in parentheses
        const needsParens = prevInput.includes('+') || 
                          prevInput.includes('-') || 
                          prevInput.includes('*') || 
                          prevInput.includes('/');
        
        if (needsParens) {
          return `(${prevInput})!`;
        } else {
          return `${prevInput}!`;
        }
      } catch {
        return prevInput + '!';
      }
    });
  };

  const appendPower = () => {
    setInput(prevInput => prevInput + '^');
  };

  const toggleAngleMode = () => {
    setInDegrees(prev => !prev);
  };

  const appendAbsoluteValue = () => {
    setInput(prevInput => `abs(${prevInput})`);
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
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs font-medium px-2 py-1 bg-kawaii-blue-light/50 rounded-md">
          Mode: {inDegrees ? 'DEG' : 'RAD'}
        </div>
        
        <MemoryPanel
          memory={memoryValue}
          onMemoryRecall={handleMemoryRecall}
          onMemoryClear={handleMemoryClear}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
        />
      </div>
      
      <div className="grid grid-cols-5 gap-1.5 mt-3">
        {/* Row 1 */}
        <CalculatorButton value="sin" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="cos" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="tan" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="log" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="ln" onClick={handleButtonClick} variant="function" className="text-sm" />

        {/* Row 2 */}
        <CalculatorButton value="sin⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="cos⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="tan⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" />
        <CalculatorButton value="!" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="|x|" onClick={handleButtonClick} variant="function" className="text-sm" />

        {/* Row 3 */}
        <CalculatorButton value="(" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value=")" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="%" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="xʸ" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="DEG/RAD" onClick={handleButtonClick} variant="function" className="text-xs" />

        {/* Row 4 */}
        <CalculatorButton value="x²" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="x³" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="√" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="π" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="e" onClick={handleButtonClick} variant="function" />

        {/* Row 5 */}
        <CalculatorButton value="7" onClick={handleButtonClick} />
        <CalculatorButton value="8" onClick={handleButtonClick} />
        <CalculatorButton value="9" onClick={handleButtonClick} />
        <CalculatorButton value="⌫" onClick={handleButtonClick} variant="clear" />
        <CalculatorButton value="C" onClick={handleButtonClick} variant="clear" />

        {/* Row 6 */}
        <CalculatorButton value="4" onClick={handleButtonClick} />
        <CalculatorButton value="5" onClick={handleButtonClick} />
        <CalculatorButton value="6" onClick={handleButtonClick} />
        <CalculatorButton value="*" onClick={handleButtonClick} variant="operator" label="×" />
        <CalculatorButton value="/" onClick={handleButtonClick} variant="operator" label="÷" />

        {/* Row 7 */}
        <CalculatorButton value="1" onClick={handleButtonClick} />
        <CalculatorButton value="2" onClick={handleButtonClick} />
        <CalculatorButton value="3" onClick={handleButtonClick} />
        <CalculatorButton value="+" onClick={handleButtonClick} variant="operator" />
        <CalculatorButton value="-" onClick={handleButtonClick} variant="operator" />

        {/* Row 8 */}
        <CalculatorButton value="0" onClick={handleButtonClick} colSpan={2} />
        <CalculatorButton value="." onClick={handleButtonClick} />
        <CalculatorButton value="±" onClick={handleButtonClick} variant="function" />
        <CalculatorButton value="=" onClick={handleButtonClick} variant="equals" />
      </div>
    </div>
  );
};

export default ScientificCalculator;
