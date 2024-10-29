import { describe, expect, it } from 'vitest';
import validateDateField from './validate-date-field.js';

describe('validateDateField', () => {
	const testCases = [
		// Basic date formats
		'2024-01-01', // Start of year
		'2024-12-31', // End of year
		'2024-02-29', // Leap year date

		// Date with times
		'2024-01-01T12:00:00', // Basic datetime
		'2024-01-01T12:00:00Z', // UTC datetime
		'2024-01-01T12:00:00.000Z', // With milliseconds
		'2024-01-01T12:00:00+01:00', // With timezone offset
		'2024-01-01T12:00:00-05:00' // Negative timezone offset
	];

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

	for (const testCase of testCases) {
		it(`should not return an error for valid date string "${testCase}"`, () => {
			const field = { type: 'Date' as const, format: 'ISO-8601' as const };
			const result = validateDateField(testCase, field);
			expect(result).toEqual([]);
		});
	}

	it('should handle custom path in error messages', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const result = validateDateField('invalid-date', field, ['data', 'dateField']);
		expect(result).toEqual([{ path: ['data', 'dateField'], message: 'Invalid date format' }]);
	});
});
