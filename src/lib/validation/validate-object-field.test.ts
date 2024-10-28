import { describe, expect, it } from 'vitest';
import validateObjectField from './validate-object-field.js';

describe('validateObjectField', () => {
	it('should return an error for non-object values', () => {
		const field = { type: 'Object' as const, properties: {} };

		const result = validateObjectField(12345, field, []);

		expect(result).toEqual([{ path: [], message: 'Expected object, got number' }]);
	});

	it('should return an error for null values', () => {
		const field = { type: 'Object' as const, properties: {} };

		const result = validateObjectField(null, field, []);

		expect(result).toEqual([{ path: [], message: 'Expected object, got object' }]);
	});

	it('should return an error for missing required properties', () => {
		const field = { type: 'Object' as const, properties: {}, required: ['name'] };

		const result = validateObjectField({}, field, []);

		expect(result).toEqual([{ path: ['name'], message: 'Required property missing' }]);
	});

	it('should validate nested properties', () => {
		const field = {
			type: 'Object' as const,
			properties: {
				name: { type: 'String' as const },
				age: { type: 'Number' as const }
			},
			required: ['name']
		};

		const result = validateObjectField({ name: 'John', age: 'twenty' }, field, []);

		expect(result).toEqual([{ path: ['age'], message: 'Expected number, got string' }]);
	});

	it('should handle custom path in error messages', () => {
		const field = {
			type: 'Object' as const,
			properties: { name: { type: 'String' as const } },
			required: ['name']
		};

		const result = validateObjectField({}, field, ['data', 'user']);

		expect(result).toEqual([
			{ path: ['data', 'user', 'name'], message: 'Required property missing' }
		]);
	});

	it('should not return an error for valid object', () => {
		const field = {
			type: 'Object' as const,
			properties: {
				name: { type: 'String' as const },
				age: { type: 'Number' as const }
			},
			required: ['name']
		};

		const result = validateObjectField({ name: 'John', age: 30 }, field, []);

		expect(result).toEqual([]);
	});
});
