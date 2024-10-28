import { describe, expect, it } from 'vitest';
import isDateField from './is-date-field.js';

describe('isDateField', () => {
	it('should return true for a field with type "Date"', () => {
		const field = { type: 'Date' };

		expect(isDateField(field)).toBe(true);
	});

	for (const type of ['Array', 'Boolean', 'Number', 'Object', 'String']) {
		it('should return false for a field with a different type', () => {
			const field = { type };

			expect(isDateField(field)).toBe(false);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isDateField(value)).toBe(false);
		});
	}
});
