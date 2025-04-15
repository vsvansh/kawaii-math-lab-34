
// Calculator utility functions

// Parse and evaluate mathematical expressions
export function evaluateExpression(expression: string): string {
  try {
    // Replace % with /100 for percentage calculations
    const processedExpr = expression.replace(/(\d+)%/g, '($1/100)');
    
    // Handle special constants
    const withConstants = processedExpr
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');
    
    // Safe evaluation using Function constructor
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + withConstants + ')')();
    
    // Format the result
    if (typeof result === 'number') {
      // Handle very small or very large numbers with scientific notation
      if (Math.abs(result) < 0.000001 || Math.abs(result) > 10000000) {
        return result.toExponential(6);
      }
      
      // Regular number formatting with up to 10 decimal places
      const formatted = parseFloat(result.toFixed(10)).toString();
      return formatted;
    }
    
    return result.toString();
  } catch (error) {
    // Return error message for invalid expressions
    return "Error";
  }
}

// Calculate trigonometric functions (in radians or degrees)
export function calculateTrigFunction(
  func: string, 
  value: number, 
  inDegrees: boolean = false
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
