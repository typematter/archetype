import type { ValidationError } from '$types/validation-error.js';
import { describe, expect, it } from 'vitest';
import validationError from './validation-error.js';

describe('validationError', () => {
	it('should return a ValidationError with the provided message and path', () => {
		const message = 'This is an error message';
		const path = ['field1', 'field2'];

		const result: ValidationError = validationError(message, path);

		expect(result).toEqual({ message, path });
	});

	it('should return a ValidationError with an empty path if no path is provided', () => {
		const message = 'This is an error message';

		const result: ValidationError = validationError(message);

		expect(result).toEqual({ message, path: [] });
	});
});
