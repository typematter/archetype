import { describe, expect, test } from 'vitest';
import { isValidDate } from './iso8601.js';

describe('ISO-8601 date validation', () => {
	const validTestCases = [
		// Calendar dates
		'2024-01-01', // Basic date (valid)
		'2024-12-31', // End of year (valid)
		'2024-02-29', // Leap year date (valid)

		// Calendar dates with times
		'2024-01-01T12:00:00Z', // UTC time (valid)
		'2024-01-01T12:00:00.000Z', // With milliseconds (valid)
		'2024-01-01T12:00:00+01:00', // With timezone (valid)

		// Week dates
		'2024-W01', // First week (valid)
		'2024-W01-1', // Monday of first week (valid)
		'2024-W53', // Week 53 (depends on year)

		// Ordinal dates
		'2024-001', // First day (valid)
		'2024-365', // Last day normal year (valid)
		'2024-366' // Last day leap year (valid)
	];

	const invalidTestCases = [
		// Calendar dates
		'2024-02-30',

		// Week dates
		'2024-W54',
		'2024-W01-8',

		// Ordinal dates
		'2024-367'
	];

	for (const dateString of validTestCases) {
		test(`${dateString} is a valid ISO-8601 date`, () => {
			expect(isValidDate(dateString)).toBe(true);
		});
	}

	for (const dateString of invalidTestCases) {
		test(`${dateString} is not a valid ISO-8601 date`, () => {
			expect(isValidDate(dateString)).not.toBe(true);
		});
	}
});
