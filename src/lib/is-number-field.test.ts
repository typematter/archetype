import { describe, expect, it } from 'vitest';
import isNumberField from './is-number-field.js';

describe('isNumberField', () => {
	it('should return true for a field with type "Number"', () => {
		const field = { type: 'Number' };

		expect(isNumberField(field)).toBe(true);
	});

	for (const type of ['Array', 'Boolean', 'Date', 'Object', 'String']) {
		it('should return false for a field with a different type', () => {
			const field = { type };

			expect(isNumberField(field)).toBe(false);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isNumberField(value)).toBe(false);
		});
	}
});
