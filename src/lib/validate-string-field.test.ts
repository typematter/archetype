import { describe, expect, it } from 'vitest';
import validateStringField from './validate-string-field.js';

describe('validateStringField', () => {
	it('should return an error if the value is not a string', () => {
		const field = { type: 'String' as const };
		const value = 123;
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Expected string, got number'
			}
		]);
	});

	it('should return no errors if the value is a valid string', () => {
		const field = { type: 'String' as const };
		const value = 'valid string';
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([]);
	});

	it('should return an error if the value is not in the enum list', () => {
		const field = { type: 'String' as const, enum: ['one', 'two', 'three'] };
		const value = 'four';
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Value must be one of: one, two, three'
			}
		]);
	});

	it('should return no errors if the value is in the enum list', () => {
		const field = { type: 'String' as const, enum: ['one', 'two', 'three'] };
		const value = 'two';
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([]);
	});

	it('should return an error if the value does not match the pattern', () => {
		const field = { type: 'String' as const, pattern: '^\\d+$' };
		const value = 'abc';
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Value does not match pattern: ^\\d+$'
			}
		]);
	});

	it('should return no errors if the value matches the pattern', () => {
		const field = { type: 'String' as const, pattern: '^\\d+$' };
		const value = '123';
		const path = ['field'];

		const errors = validateStringField(value, field, path);

		expect(errors).toEqual([]);
	});
});
