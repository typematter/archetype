import { describe, expect, it } from 'vitest';
import type { UnknownField } from './schema-field.js';
import validateSchemaField from './validate-schema-field.js';
import type { ValidationError } from './validation-error.js';

describe('validateSchemaField', () => {
	it('should validate string fields', () => {
		const field = { type: 'String' };
		const value = 'test';

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate number fields', () => {
		const field = { type: 'Number' };
		const value = 123;

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate boolean fields', () => {
		const field = { type: 'Boolean' };
		const value = true;

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate date fields', () => {
		const field = { type: 'Date', format: 'ISO8601' };
		const value = new Date().toDateString();

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate array fields', () => {
		const field = { type: 'Array', items: { type: 'String' } };
		const value = ['test'];

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate object fields', () => {
		const field = { type: 'Object', properties: { key: { type: 'String' } } };
		const value = { key: 'test' };

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should throw an error for unknown field types', () => {
		const field: UnknownField = { type: 'unknown' };
		const value = 'test';

		expect(() => validateSchemaField(value, field)).toThrow('Unknown field type: unknown');
	});
});
