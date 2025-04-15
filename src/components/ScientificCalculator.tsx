
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
  
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  const memoryValue = externalMemory !== undefined ? externalMemory : localMemory;
  const setMemoryValue = setExternalMemory || setLocalMemory;
  
  const getCursorPosition = (input: string): number => {
    const openParens = (input.match(/\(/g) || []).length;
    const closeParens = (input.match(/\)/g) || []).length;
    
    if (openParens > closeParens) {
      let openCount = 0;
      let closeCount = 0;
      
      for (let i = 0; i < input.length; i++) {
        if (input[i] === '(') openCount++;
        if (input[i] === ')') closeCount++;
        
        if (openCount > closeCount) {
          const pos = input.indexOf('(', i - 1) + 1;
          if (pos > 0) return pos;
        }
      }
    }
    
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
        let processedInput = input;
        const openCount = (processedInput.match(/\(/g) || []).length;
        const closeCount = (processedInput.match(/\)/g) || []).length;
        
        if (openCount > closeCount) {
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
    if (cursorPosition !== null && cursorPosition >= 0 && cursorPosition <= input.length) {
      const before = input.substring(0, cursorPosition);
      const after = input.substring(cursorPosition);
      setInput(before + value + after);
      setCursorPosition(cursorPosition + value.length);
    } else {
      setInput(prevInput => {
        const operators = ['+', '-', '*', '/', '.'];
        const lastChar = prevInput.slice(-1);
        
        if (operators.includes(value) && operators.includes(lastChar)) {
          return prevInput.slice(0, -1) + value;
        }
        
        if (value === ')') {
          const openCount = (prevInput.match(/\(/g) || []).length;
          const closeCount = (prevInput.match(/\)/g) || []).length;
          
          if (openCount <= closeCount) {
            return prevInput;
          }
        }
        
        const newInput = prevInput + value;
        try {
          if (isCompleteExpression(newInput)) {
            let processedInput = newInput;
            const openCount = (processedInput.match(/\(/g) || []).length;
            const closeCount = (processedInput.match(/\)/g) || []).length;
            
            if (openCount > closeCount) {
              processedInput += ')'.repeat(openCount - closeCount);
            }
            
            const preview = evaluateExpression(processedInput);
            if (preview !== "Error") {
              setResult(preview);
            }
          }
        } catch {
          setResult("Error");
        }
        
        return newInput;
      });
    }
  };

  const isCompleteExpression = (expr: string): boolean => {
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    
    if (openCount !== closeCount) return false;
    
    const operators = ['+', '-', '*', '/', '^'];
    if (operators.includes(expr.slice(-1))) return false;
    
    const funcPattern = /(sin|cos|tan|log|ln|sqrt|abs)$/;
    if (funcPattern.test(expr)) return false;
    
    return true;
  };

  const appendFunctionWithParentheses = (func: string) => {
    setInput(prevInput => {
      const newInput = prevInput + `${func}()`;
      // Position cursor inside the parentheses
      setCursorPosition(prevInput.length + func.length + 1);
      return newInput;
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
        const newInput = 'abs()';
        setCursorPosition(4);
        return newInput;
      }
      
      const needsWrap = !prevInput.endsWith('(');
      
      if (needsWrap) {
        return `abs(${prevInput})`;
      } else {
        const newInput = `${prevInput}abs()`;
        setCursorPosition(prevInput.length + 4);
        return newInput;
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

  const handleCalculatorPaste = (pastedText: string) => {
    if (pastedText) {
      setInput(prevInput => {
        if (cursorPosition !== null && cursorPosition <= prevInput.length) {
          const before = prevInput.substring(0, cursorPosition);
          const after = prevInput.substring(cursorPosition);
          setCursorPosition(cursorPosition + pastedText.length);
          return before + pastedText + after;
        } else {
          return prevInput + pastedText;
        }
      });
      
      try {
        setTimeout(() => {
          const expressionToEvaluate = cursorPosition !== null 
            ? input.substring(0, cursorPosition) + pastedText + input.substring(cursorPosition)
            : input + pastedText;
            
          const preview = evaluateExpression(expressionToEvaluate);
          if (preview !== "Error") {
            setResult(preview);
          }
        }, 10);
      } catch (err) {
        console.error("Paste error:", err);
      }
    }
  };

  const handlePasteButtonClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Filter to only allow valid calculator characters
        const filteredText = text.replace(/[^0-9+\-*/().%^πe]/g, '');
        handleCalculatorPaste(filteredText);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  useEffect(() => {
    if (cursorPosition !== null) {
      const timer = setTimeout(() => {
        setCursorPosition(null);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [cursorPosition]);

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
          onPaste={handlePasteButtonClick}
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
