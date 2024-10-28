import { describe, expect, it } from 'vitest';
import validateBooleanField from './validate-boolean-field.js';

describe('validateBooleanField', () => {
	it('should return an error if the value is not a boolean', () => {
		const field = { type: 'Boolean' as const };
		const value = 'not a boolean';
		const path = ['field'];

		const errors = validateBooleanField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Expected boolean, got string'
			}
		]);
	});

	it('should return no errors if the value is a boolean', () => {
		const field = { type: 'Boolean' as const };
		const value = true;
		const path = ['field'];

		const errors = validateBooleanField(value, field, path);

		expect(errors).toEqual([]);
	});
});
