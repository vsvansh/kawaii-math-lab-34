import React, { useState, useRef, useEffect } from 'react';
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
  isSoundEnabled?: boolean;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ 
  input, 
  setInput, 
  result, 
  setResult, 
  addToHistory,
  memory: externalMemory,
  setMemory: setExternalMemory,
  isSoundEnabled = false
}) => {
  const [inDegrees, setInDegrees] = useState(true);
  
  const [localMemory, setLocalMemory] = useState<string | null>(null);
  
  const memoryValue = externalMemory !== undefined ? externalMemory : localMemory;
  const setMemoryValue = setExternalMemory || setLocalMemory;
  
  // Function to get cursor position in the input
  const getCursorPosition = (input: string): number => {
    // Count open and close parentheses
    const openParens = (input.match(/\(/g) || []).length;
    const closeParens = (input.match(/\)/g) || []).length;
    
    // If there are more open parentheses than closed ones,
    // position is after the last open parenthesis without a matching closing one
    if (openParens > closeParens) {
      let openCount = 0;
      let closeCount = 0;
      
      for (let i = 0; i < input.length; i++) {
        if (input[i] === '(') openCount++;
        if (input[i] === ')') closeCount++;
        
        // When we find an open parenthesis without a matching close one
        if (openCount > closeCount) {
          // Find the position after this open parenthesis
          const pos = input.indexOf('(', i - 1) + 1;
          if (pos > 0) return pos;
        }
      }
    }
    
    // Default to end of input
    return input.length;
  };
  
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
        // Ensure all parentheses are properly closed before evaluation
        let processedInput = input;
        const openCount = (processedInput.match(/\(/g) || []).length;
        const closeCount = (processedInput.match(/\)/g) || []).length;
        
        if (openCount > closeCount) {
          // Add missing closing parentheses
          processedInput += ')'.repeat(openCount - closeCount);
        }
        
        const calculatedResult = evaluateExpression(processedInput);
        if (calculatedResult !== "Error") {
          setResult(calculatedResult);
          addToHistory(processedInput, calculatedResult);
        } else {
          setResult("Error");
        }
      }
    } catch (error) {
      setResult("Error");
      console.error("Calculation error:", error);
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
      
      // If operators are repeated, replace the last one
      if (operators.includes(value) && operators.includes(lastChar)) {
        return prevInput.slice(0, -1) + value;
      }
      
      // Special handling for parentheses input
      if (value === ')') {
        // Only add closing parenthesis if there's an open one
        const openCount = (prevInput.match(/\(/g) || []).length;
        const closeCount = (prevInput.match(/\)/g) || []).length;
        
        if (openCount <= closeCount) {
          return prevInput; // Don't add extra closing parentheses
        }
      }
      
      const newInput = prevInput + value;
      try {
        // Only calculate preview if there's a complete expression
        if (isCompleteExpression(newInput)) {
          // Ensure all parentheses are properly closed before preview calculation
          let processedInput = newInput;
          const openCount = (processedInput.match(/\(/g) || []).length;
          const closeCount = (processedInput.match(/\)/g) || []).length;
          
          if (openCount > closeCount) {
            // Add temporary closing parentheses for preview
            processedInput += ')'.repeat(openCount - closeCount);
          }
          
          const preview = evaluateExpression(processedInput);
          if (preview !== "Error") {
            setResult(preview);
          }
        }
      } catch {
        // Ignore calculation errors during input
      }
      
      return newInput;
    });
  };

  // Helper to check if the expression is complete enough to evaluate
  const isCompleteExpression = (expr: string): boolean => {
    // Check for balanced parentheses
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    
    // Don't evaluate if parentheses are unbalanced
    if (openCount !== closeCount) return false;
    
    // Don't evaluate if ends with operator
    const operators = ['+', '-', '*', '/', '^'];
    if (operators.includes(expr.slice(-1))) return false;
    
    // Don't evaluate if ends with function name without closing parenthesis
    const funcPattern = /(sin|cos|tan|log|ln|sqrt|abs)$/;
    if (funcPattern.test(expr)) return false;
    
    return true;
  };

  // Reference to store current cursor position in the input
  const cursorPosRef = useRef<number | null>(null);
  
  // Generic function to append any function with parentheses
  // and automatically place cursor inside the parentheses
  const appendFunctionWithParentheses = (func: string) => {
    const functionWithParentheses = `${func}()`;
    const cursorOffset = func.length + 1; // Position after opening parenthesis
    
    setInput(prevInput => {
      // Store new cursor position for reference
      cursorPosRef.current = prevInput.length + cursorOffset;
      return prevInput + functionWithParentheses;
    });
  };

  const appendTrigFunction = (func: string) => {
    appendFunctionWithParentheses(func);
  };

  const appendLogFunction = (func: string) => {
    appendFunctionWithParentheses(func);
  };

  const appendSquare = () => {
    setInput(prevInput => {
      // Check if we need to wrap the expression in parentheses
      const needsParens = prevInput.includes('+') || 
                          prevInput.includes('-') || 
                          prevInput.includes('*') || 
                          prevInput.includes('/');
      
      if (needsParens) {
        return `(${prevInput})^2`;
      } else {
        return prevInput !== '' ? `${prevInput}^2` : '';
      }
    });
  };

  const appendCube = () => {
    setInput(prevInput => {
      // Check if we need to wrap the expression in parentheses
      const needsParens = prevInput.includes('+') || 
                          prevInput.includes('-') || 
                          prevInput.includes('*') || 
                          prevInput.includes('/');
      
      if (needsParens) {
        return `(${prevInput})^3`;
      } else {
        return prevInput !== '' ? `${prevInput}^3` : '';
      }
    });
  };

  const appendSquareRoot = () => {
    appendFunctionWithParentheses('sqrt');
  };

  const appendConstant = (constant: string) => {
    setInput(prevInput => prevInput + constant);
  };

  const appendFactorial = () => {
    setInput(prevInput => {
      if (!prevInput) return '';
      
      // Check if we need to wrap the expression in parentheses
      const needsParens = prevInput.includes('+') || 
                        prevInput.includes('-') || 
                        prevInput.includes('*') || 
                        prevInput.includes('/');
      
      if (needsParens) {
        return `(${prevInput})!`;
      } else {
        return `${prevInput}!`;
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
    setInput(prevInput => {
      if (!prevInput) {
        cursorPosRef.current = 4; // Position after 'abs('
        return 'abs()';
      }
      
      // Check if we need to wrap existing input or just start a new function
      const needsWrap = !prevInput.endsWith('(');
      
      if (needsWrap) {
        // In this case, no need to position cursor inside as we're wrapping existing input
        return `abs(${prevInput})`;
      } else {
        cursorPosRef.current = prevInput.length + 4; // Position after 'abs('
        return `${prevInput}abs()`;
      }
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

  // Handle pasted content
  const handleCalculatorPaste = (pastedText: string) => {
    if (pastedText) {
      setInput(prevInput => {
        // If we have a cursor position, insert at that position
        if (cursorPosRef.current !== null && cursorPosRef.current <= prevInput.length) {
          const before = prevInput.substring(0, cursorPosRef.current);
          const after = prevInput.substring(cursorPosRef.current);
          // Update cursor position
          cursorPosRef.current = cursorPosRef.current + pastedText.length;
          return before + pastedText + after;
        } else {
          // Otherwise append to the end
          return prevInput + pastedText;
        }
      });
      
      // Try to calculate preview with the pasted content
      try {
        setTimeout(() => {
          const preview = evaluateExpression(input + pastedText);
          if (preview !== "Error") {
            setResult(preview);
          }
        }, 10);
      } catch {
        // Ignore calculation errors during paste
      }
    }
  };

  // Effect to handle auto-positioning cursor inside parentheses
  useEffect(() => {
    if (cursorPosRef.current !== null) {
      // This would be used if we had a real input element
      // Since we don't, we just keep track of the position
      
      // Reset cursor position after using it
      setTimeout(() => {
        cursorPosRef.current = null;
      }, 100);
    }
  }, [input]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <CalculatorDisplay 
        input={input} 
        result={result}
        onInputPaste={handleCalculatorPaste}
      />
      
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
        <CalculatorButton value="sin" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="cos" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="tan" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="log" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="ln" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="sin⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="cos⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="tan⁻¹" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="!" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="|x|" onClick={handleButtonClick} variant="function" className="text-sm" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="(" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value=")" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="%" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="xʸ" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="DEG/RAD" onClick={handleButtonClick} variant="function" className="text-xs" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="x²" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="x³" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="√" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="π" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="e" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="7" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="8" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="9" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="⌫" onClick={handleButtonClick} variant="clear" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="C" onClick={handleButtonClick} variant="clear" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="4" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="5" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="6" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="*" onClick={handleButtonClick} variant="operator" label="×" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="/" onClick={handleButtonClick} variant="operator" label="÷" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="1" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="2" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="3" onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="+" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="-" onClick={handleButtonClick} variant="operator" isSoundEnabled={isSoundEnabled} />

        <CalculatorButton value="0" onClick={handleButtonClick} colSpan={2} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="." onClick={handleButtonClick} isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="±" onClick={handleButtonClick} variant="function" isSoundEnabled={isSoundEnabled} />
        <CalculatorButton value="=" onClick={handleButtonClick} variant="equals" isSoundEnabled={isSoundEnabled} />
      </div>
    </div>
  );
};

export default ScientificCalculator;
