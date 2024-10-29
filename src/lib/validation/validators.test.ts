import type { ValidationError } from '$types/validation-error.js';
import { describe, expect, it } from 'vitest';
import validators from './validators.js';

describe('validators', () => {
	const testCases = [
		{
			type: 'Array' as const,
			value: [1, 2, 3],
			field: { type: 'Array', items: { type: 'Number' } },
			expectedErrors: []
		},
		{
			type: 'Boolean' as const,
			value: true,
			field: { type: 'Boolean' },
			expectedErrors: []
		},
		{
			type: 'Date' as const,
			value: '2023-01-01',
			field: { type: 'Date' },
			expectedErrors: []
		},
		{
			type: 'Number' as const,
			value: 42,
			field: { type: 'Number' },
			expectedErrors: []
		},
		{
			type: 'Object' as const,
			value: { name: 'John', age: 30 },
			field: {
				type: 'Object',
				properties: {
					name: { type: 'String' },
					age: { type: 'Number' }
				}
			},
			expectedErrors: []
		},
		{
			type: 'String' as const,
			value: 'Hello, world!',
			field: { type: 'String' },
			expectedErrors: []
		}
	];

	testCases.forEach(({ type, value, field, expectedErrors }) => {
		it(`should validate ${type} field correctly`, () => {
			const errors: ValidationError[] = validators[type](value, field as never, []);

			expect(errors).toEqual(expectedErrors);
		});
	});
});
