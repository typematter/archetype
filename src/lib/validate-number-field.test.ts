import { describe, expect, it } from 'vitest';
import validateNumberField from './validate-number-field.js';

describe('validateNumberField', () => {
	it('should return an error if the value is not a number', () => {
		const field = { type: 'Number' as const };
		const value = 'not a number';
		const path = ['field'];

		const errors = validateNumberField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Expected number, got string'
			}
		]);
	});

	it('should return no errors if the value is a number within the range', () => {
		const field = { type: 'Number' as const, min: 1, max: 10 };
		const value = 5;
		const path = ['field'];

		const errors = validateNumberField(value, field, path);

		expect(errors).toEqual([]);
	});

	it('should return an error if the value is less than the minimum', () => {
		const field = { type: 'Number' as const, min: 1 };
		const value = 0;
		const path = ['field'];

		const errors = validateNumberField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Value must be >= 1'
			}
		]);
	});

	it('should return an error if the value is greater than the maximum', () => {
		const field = { type: 'Number' as const, max: 10 };
		const value = 11;
		const path = ['field'];

		const errors = validateNumberField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Value must be <= 10'
			}
		]);
	});
});
