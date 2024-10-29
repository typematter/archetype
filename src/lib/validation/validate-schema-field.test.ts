import type { UnknownField } from '$types/schema-field.js';
import type { ValidationError } from 'src/types/validation-error.js';
import { describe, expect, it } from 'vitest';
import validateSchemaField from './validate-schema-field.js';

describe('validateSchemaField', () => {
	it('should validate string fields', () => {
		const field = { type: 'String' as const };
		const value = 'test';

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate number fields', () => {
		const field = { type: 'Number' as const };
		const value = 123;

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate boolean fields', () => {
		const field = { type: 'Boolean' as const };
		const value = true;

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate date fields', () => {
		const field = { type: 'Date' as const, format: 'ISO-8601' as const };
		const value = new Date().toISOString();

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate array fields', () => {
		const field = { type: 'Array' as const, items: { type: 'String' as const } };
		const value = ['test'];

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should validate object fields', () => {
		const field = { type: 'Object' as const, properties: { key: { type: 'String' as const } } };
		const value = { key: 'test' };

		const errors: ValidationError[] = validateSchemaField(value, field);

		expect(errors).toEqual([]);
	});

	it('should throw an error for unknown field types', () => {
		const field: UnknownField = { type: 'unknown' };
		const value = 'test';

		expect(() => validateSchemaField(value, field as never)).toThrow(
			'No validator found for type: unknown'
		);
	});
});
