import { describe, expect, it } from 'vitest';
import isBooleanField from './is-boolean-field.js';

describe('isBooleanField', () => {
	it('should return true for a field with type "Boolean"', () => {
		const field = { type: 'Boolean' };

		expect(isBooleanField(field)).toBe(true);
	});

	for (const type of ['Array', 'Date', 'Number', 'Object', 'String']) {
		it('should return false for a field with a different type', () => {
			const field = { type };

			expect(isBooleanField(field)).toBe(false);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isBooleanField(value)).toBe(false);
		});
	}
});
