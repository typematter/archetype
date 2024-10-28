import { describe, expect, it } from 'vitest';
import validateArrayField from './validate-array-field.js';

describe('validateArrayField', () => {
	it('should return an error if the value is not an array', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const } };
		const value = 'not an array';
		const path = ['field'];

		const errors = validateArrayField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Expected array, got string'
			}
		]);
	});

	it('should return no errors if the value is a valid array', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const } };
		const value = ['valid', 'array'];
		const path = ['field'];

		const errors = validateArrayField(value, field, path);

		expect(errors).toEqual([]);
	});

	it('should return an error if the array has fewer items than minItems', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const }, minItems: 3 };
		const value = ['one', 'two'];
		const path = ['field'];

		const errors = validateArrayField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Array must contain at least 3 items'
			}
		]);
	});

	it('should return an error if the array has more items than maxItems', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const }, maxItems: 2 };
		const value = ['one', 'two', 'three'];
		const path = ['field'];

		const errors = validateArrayField(value, field, path);

		expect(errors).toEqual([
			{
				path,
				message: 'Array must contain at most 2 items'
			}
		]);
	});

	it('should return errors for invalid items in the array', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const } };
		const value = ['valid', 123, 'another valid'];
		const path = ['field'];

		const errors = validateArrayField(value, field, path);

		expect(errors).toEqual([
			{
				path: ['field', '1'],
				message: 'Expected string, got number'
			}
		]);
	});
});
