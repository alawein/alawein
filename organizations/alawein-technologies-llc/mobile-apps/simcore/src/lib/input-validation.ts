// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean;
  value: any;
  error?: string;
}

export class InputValidator {
  // Sanitize and validate search input
  static validateSearchInput(input: unknown): ValidationResult {
    if (typeof input !== 'string') {
      return {
        isValid: false,
        value: '',
        error: 'Search input must be a string'
      };
    }

    // Remove dangerous characters and HTML tags
    const sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>&"'`]/g, '') // Remove dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 100); // Limit length

    return {
      isValid: true,
      value: sanitized,
      error: undefined
    };
  }

  // Validate numeric physics parameters
  static validatePhysicsParameter(
    input: unknown, 
    min?: number, 
    max?: number,
    parameterName?: string
  ): ValidationResult {
    const num = Number(input);
    
    if (isNaN(num) || !isFinite(num)) {
      return {
        isValid: false,
        value: 0,
        error: `${parameterName || 'Parameter'} must be a valid number`
      };
    }
    
    if (min !== undefined && num < min) {
      return {
        isValid: false,
        value: min,
        error: `${parameterName || 'Parameter'} must be at least ${min}`
      };
    }
    
    if (max !== undefined && num > max) {
      return {
        isValid: false,
        value: max,
        error: `${parameterName || 'Parameter'} must be at most ${max}`
      };
    }
    
    return {
      isValid: true,
      value: num,
      error: undefined
    };
  }

  // Validate array inputs for physics calculations
  static validatePhysicsArray(
    input: unknown,
    maxLength = 10000,
    elementValidator?: (element: any) => boolean
  ): ValidationResult {
    if (!Array.isArray(input)) {
      return {
        isValid: false,
        value: [],
        error: 'Input must be an array'
      };
    }

    if (input.length === 0) {
      return {
        isValid: false,
        value: [],
        error: 'Array cannot be empty'
      };
    }

    if (input.length > maxLength) {
      return {
        isValid: false,
        value: input.slice(0, maxLength),
        error: `Array too large. Maximum ${maxLength} elements allowed`
      };
    }

    // Validate each element if validator provided
    if (elementValidator) {
      const invalidIndex = input.findIndex(element => !elementValidator(element));
      if (invalidIndex !== -1) {
        return {
          isValid: false,
          value: input,
          error: `Invalid element at index ${invalidIndex}`
        };
      }
    }

    return {
      isValid: true,
      value: input,
      error: undefined
    };
  }

  // Validate complex numbers for quantum mechanics
  static validateComplexNumber(input: unknown): ValidationResult {
    if (typeof input !== 'object' || input === null) {
      return {
        isValid: false,
        value: { real: 0, imag: 0 },
        error: 'Complex number must be an object'
      };
    }

    const obj = input as any;
    const real = Number(obj.real);
    const imag = Number(obj.imag);

    if (isNaN(real) || isNaN(imag) || !isFinite(real) || !isFinite(imag)) {
      return {
        isValid: false,
        value: { real: 0, imag: 0 },
        error: 'Complex number must have valid real and imaginary parts'
      };
    }

    return {
      isValid: true,
      value: { real, imag },
      error: undefined
    };
  }

  // Validate matrix inputs
  static validateMatrix(input: unknown, expectedRows?: number, expectedCols?: number): ValidationResult {
    if (!Array.isArray(input)) {
      return {
        isValid: false,
        value: [],
        error: 'Matrix must be an array'
      };
    }

    // Check if it's a 2D array
    if (!input.every(row => Array.isArray(row))) {
      return {
        isValid: false,
        value: [],
        error: 'Matrix must be a 2D array'
      };
    }

    const matrix = input as number[][];
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    // Check dimensions
    if (expectedRows && rows !== expectedRows) {
      return {
        isValid: false,
        value: matrix,
        error: `Matrix must have ${expectedRows} rows, got ${rows}`
      };
    }

    if (expectedCols && cols !== expectedCols) {
      return {
        isValid: false,
        value: matrix,
        error: `Matrix must have ${expectedCols} columns, got ${cols}`
      };
    }

    // Check if all rows have the same length
    const inconsistentRow = matrix.findIndex(row => row.length !== cols);
    if (inconsistentRow !== -1) {
      return {
        isValid: false,
        value: matrix,
        error: `All rows must have the same length. Row ${inconsistentRow} has different length`
      };
    }

    // Check if all elements are valid numbers
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const element = Number(matrix[i][j]);
        if (isNaN(element) || !isFinite(element)) {
          return {
            isValid: false,
            value: matrix,
            error: `Invalid number at position [${i}, ${j}]`
          };
        }
        matrix[i][j] = element;
      }
    }

    return {
      isValid: true,
      value: matrix,
      error: undefined
    };
  }

  // Validate email addresses
  static validateEmail(input: unknown): ValidationResult {
    if (typeof input !== 'string') {
      return {
        isValid: false,
        value: '',
        error: 'Email must be a string'
      };
    }

    // Basic email regex (not perfect but good enough for most cases)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(input)) {
      return {
        isValid: false,
        value: input,
        error: 'Invalid email format'
      };
    }

    // Additional security checks
    if (input.length > 254) {
      return {
        isValid: false,
        value: input.slice(0, 254),
        error: 'Email address too long'
      };
    }

    return {
      isValid: true,
      value: input.toLowerCase().trim(),
      error: undefined
    };
  }

  // Validate URLs for external links
  static validateURL(input: unknown): ValidationResult {
    if (typeof input !== 'string') {
      return {
        isValid: false,
        value: '',
        error: 'URL must be a string'
      };
    }

    try {
      const url = new URL(input);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return {
          isValid: false,
          value: input,
          error: 'Only HTTP and HTTPS URLs are allowed'
        };
      }

      return {
        isValid: true,
        value: url.toString(),
        error: undefined
      };
    } catch {
      return {
        isValid: false,
        value: input,
        error: 'Invalid URL format'
      };
    }
  }
}

// Hook for using validation in React components
export const useInputValidation = () => {
  return {
    validateSearchInput: InputValidator.validateSearchInput,
    validatePhysicsParameter: InputValidator.validatePhysicsParameter,
    validatePhysicsArray: InputValidator.validatePhysicsArray,
    validateComplexNumber: InputValidator.validateComplexNumber,
    validateMatrix: InputValidator.validateMatrix,
    validateEmail: InputValidator.validateEmail,
    validateURL: InputValidator.validateURL,
  };
};

export default InputValidator;