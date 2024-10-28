import { describe, expect, it } from 'vitest';
import validateDateField from './validate-date-field.js';

describe('validateDateField', () => {
	it('should return an error for non-string values', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField(12345, field);
		expect(result).toEqual([{ path: [], message: 'Invalid date format' }]);
	});

	it('should return an error for invalid date strings', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField('invalid-date', field);
		expect(result).toEqual([{ path: [], message: 'Invalid date format' }]);
	});

	it('should return an error for non-ISO-8601 formatted date when format is ISO-8601', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField('2023-10-01', field);
		expect(result).toEqual([{ path: [], message: 'Date must be in ISO-8601 format' }]);
	});

	it('should not return an error for valid ISO-8601 formatted date', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField('2023-10-01T12:00:00Z', field);
		expect(result).toEqual([]);
	});

	it('should handle custom path in error messages', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField('invalid-date', field, ['data', 'dateField']);
		expect(result).toEqual([{ path: ['data', 'dateField'], message: 'Invalid date format' }]);
	});
});
