import type { ValidationError } from './validation-error.js';

interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}

export type { ValidationResult };
