
// Calculator utility functions

// Parse and evaluate mathematical expressions
export function evaluateExpression(expression: string): string {
  try {
    if (!expression || expression.trim() === '') {
      return '';
    }

    // Handle special constants first
    let processedExpr = expression
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');
      
    // Handle factorial notation
    processedExpr = processedExpr.replace(/(\d+)!/g, (match, number) => {
      return calculateFactorial(parseInt(number)).toString();
    });
    
    // Handle complex factorial expressions with parentheses
    processedExpr = processedExpr.replace(/\(([^)]+)\)!/g, (match, expr) => {
      try {
        // Try to evaluate the expression inside parentheses
        const innerResult = Function('"use strict"; return (' + expr + ')')();
        if (typeof innerResult === 'number' && Number.isInteger(innerResult) && innerResult >= 0) {
          return calculateFactorial(innerResult).toString();
        }
        return match; // Keep as is if we can't calculate it
      } catch (e) {
        return match; // Keep as is if there's an error
      }
    });
    
    // Replace % with /100 for percentage calculations
    processedExpr = processedExpr.replace(/(\d+)%/g, '($1/100)');
    
    // Handle power notation (fix for x^y)
    processedExpr = processedExpr.replace(/(\d+|\))\^(\d+|\()/g, 'Math.pow($1, $2)');
    processedExpr = processedExpr.replace(/\(([^)]+)\)\^(\d+|\()/g, 'Math.pow($1, $2)');
    processedExpr = processedExpr.replace(/(\d+|\))\^\(([^)]+)\)/g, 'Math.pow($1, $2)');
    
    // Handle square root, making sure any expression inside is evaluated
    processedExpr = processedExpr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
    
    // Handle absolute value
    processedExpr = processedExpr.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
    
    // Handle trigonometric functions (convert to radians for standard Math functions)
    // Sin
    processedExpr = processedExpr.replace(/sin\(([^)]+)\)/g, (match, angle) => {
      return `Math.sin(${angle} * Math.PI / 180)`;
    });
    // Cos
    processedExpr = processedExpr.replace(/cos\(([^)]+)\)/g, (match, angle) => {
      return `Math.cos(${angle} * Math.PI / 180)`;
    });
    // Tan
    processedExpr = processedExpr.replace(/tan\(([^)]+)\)/g, (match, angle) => {
      return `Math.tan(${angle} * Math.PI / 180)`;
    });
    
    // Handle inverse trigonometric functions (convert from radians to degrees)
    processedExpr = processedExpr.replace(/sin⁻¹\(([^)]+)\)/g, (match, value) => {
      return `(Math.asin(${value}) * 180 / Math.PI)`;
    });
    processedExpr = processedExpr.replace(/cos⁻¹\(([^)]+)\)/g, (match, value) => {
      return `(Math.acos(${value}) * 180 / Math.PI)`;
    });
    processedExpr = processedExpr.replace(/tan⁻¹\(([^)]+)\)/g, (match, value) => {
      return `(Math.atan(${value}) * 180 / Math.PI)`;
    });
    
    // Handle log functions
    processedExpr = processedExpr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
    processedExpr = processedExpr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    
    // Ensure balanced parentheses for evaluation
    const openCount = (processedExpr.match(/\(/g) || []).length;
    const closeCount = (processedExpr.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      // Add missing closing parentheses
      processedExpr += ')'.repeat(openCount - closeCount);
    }
    
    // Safe evaluation using Function constructor
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + processedExpr + ')')();
    
    // Format the result
    if (typeof result === 'number') {
      // Handle very small or very large numbers with scientific notation
      if (Math.abs(result) < 0.000001 || Math.abs(result) > 10000000) {
        return result.toExponential(6);
      }
      
      // Handle NaN and Infinity
      if (isNaN(result)) return "Error";
      if (!isFinite(result)) return "Infinity";
      
      // Regular number formatting with up to 10 decimal places
      // Remove trailing zeros
      const formatted = parseFloat(result.toFixed(10)).toString();
      return formatted;
    }
    
    return result.toString();
  } catch (error) {
    // Return error message for invalid expressions
    console.error("Calculation error:", error);
    return "Error";
  }
}

// Calculate trigonometric functions (in radians or degrees)
export function calculateTrigFunction(
  func: string, 
  value: number, 
  inDegrees: boolean = true
): number {
  // Convert to radians if in degrees
  const angleInRadians = inDegrees ? (value * Math.PI) / 180 : value;
  
  switch (func.toLowerCase()) {
    case 'sin':
      return Math.sin(angleInRadians);
    case 'cos':
      return Math.cos(angleInRadians);
    case 'tan':
      return Math.tan(angleInRadians);
    case 'cot':
      return 1 / Math.tan(angleInRadians);
    case 'sec':
      return 1 / Math.cos(angleInRadians);
    case 'csc':
      return 1 / Math.sin(angleInRadians);
    case 'asin':
    case 'sin⁻¹':
      const asinResult = Math.asin(value);
      return inDegrees ? (asinResult * 180) / Math.PI : asinResult;
    case 'acos':
    case 'cos⁻¹':
      const acosResult = Math.acos(value);
      return inDegrees ? (acosResult * 180) / Math.PI : acosResult;
    case 'atan':
    case 'tan⁻¹':
      const atanResult = Math.atan(value);
      return inDegrees ? (atanResult * 180) / Math.PI : atanResult;
    default:
      return NaN;
  }
}

// Calculate logarithmic functions
export function calculateLogFunction(func: string, value: number): number {
  switch (func.toLowerCase()) {
    case 'log':
    case 'log10':
      return Math.log10(value);
    case 'ln':
    case 'loge':
      return Math.log(value);
    case 'log2':
      return Math.log2(value);
    default:
      return NaN;
  }
}

// Calculate power functions
export function calculatePower(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

// Calculate root functions
export function calculateRoot(value: number, n: number = 2): number {
  if (n === 2) return Math.sqrt(value);
  return Math.pow(value, 1 / n);
}

// Calculate factorial
export function calculateFactorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
    // Prevent overflow with a reasonable limit
    if (!isFinite(result)) return Infinity;
  }
  return result;
}

// Format the display value for better readability
export function formatDisplayValue(value: string): string {
  // Replace multiplication and division symbols for display
  return value
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

// Format scientific notation with proper superscripts
export function formatScientificNotation(value: string): string {
  if (value.includes('e')) {
    const [base, exponent] = value.split('e');
    return `${base}×10<sup>${exponent}</sup>`;
  }
  return value;
}
