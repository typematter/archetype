import { describe, expect, it } from 'vitest';
import isStringField from './is-string-field.js';

describe('isStringField', () => {
	it('should return true for a field with type "String"', () => {
		const field = { type: 'String' };

		expect(isStringField(field)).toBe(true);
	});

	for (const type of ['Array', 'Boolean', 'Date', 'Number', 'Object']) {
		it('should return false for a field with a different type', () => {
			const field = { type };

			expect(isStringField(field)).toBe(false);
		});
	}

	for (const value of [undefined, null, 'Hello, World!', 42, 3.14, true, false, [], {}]) {
		it('should return false for a non-field value', () => {
			expect(isStringField(value)).toBe(false);
		});
	}
});
