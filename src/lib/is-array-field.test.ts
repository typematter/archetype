import { describe, expect, it } from 'vitest';
import isArrayField from './is-array-field.js';

describe('isArrayField', () => {
	it('should return true for a field with type "Array"', () => {
		const field = { type: 'Array' };

		expect(isArrayField(field)).toBe(true);
	});

	for (const type of ['Boolean', 'Date', 'Number', 'Object', 'String']) {
		it('should return false for a field with a different type', () => {
			const field = { type };

			expect(isArrayField(field)).toBe(false);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isArrayField(value)).toBe(false);
		});
	}
});
