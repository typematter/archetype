import { describe, expect, it } from 'vitest';
import isUnknownField from './is-unknown-field.js';

describe('isUnknownField', () => {
	it('should return true for a field with type"', () => {
		const field = { type: 'anything' };

		expect(isUnknownField(field)).toBe(true);
	});

	for (const type of ['Array', 'Boolean', 'Date', 'Number', 'Object', 'String']) {
		it('should return true for any known field', () => {
			const field = { type };

			expect(isUnknownField(field)).toBe(true);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isUnknownField(value)).toBe(false);
		});
	}
});
