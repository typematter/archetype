import type { Archetype } from '$types/archetype.js';
import type { ValidationResult } from '$types/validation-result.js';
import { describe, expect, it } from 'vitest';
import validateArchetype from './validate-archetype.js';

describe('validateArchetype', () => {
	const personSchema: Archetype = {
		name: 'Person',
		version: '1.0.0',
		schema: {
			required: {
				name: { type: 'String' },
				age: { type: 'Number' }
			},
			optional: {
				email: { type: 'String' }
			}
		}
	};

	it('should validate a correct archetype', () => {
		const person = {
			name: 'Olive Brockwell',
			age: 42,
			email: 'alice@example.com'
		};

		const result: ValidationResult = validateArchetype(person, personSchema);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should return errors for missing required fields', () => {
		const person = {
			email: 'alice@example.com'
		};

		const result: ValidationResult = validateArchetype(person, personSchema);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([
			{ path: ['name'], message: 'Required field missing' },
			{ path: ['age'], message: 'Required field missing' }
		]);
	});

	it('should return errors for invalid field types', () => {
		const person = {
			name: 'Olive Brockwell',
			age: 'forty-two'
		};

		const result: ValidationResult = validateArchetype(person, personSchema);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([{ path: ['age'], message: 'Expected number, got string' }]);
	});

	it('should validate archetype with only required fields', () => {
		const person = {
			name: 'Olive Brockwell',
			age: 42
		};

		const result: ValidationResult = validateArchetype(person, personSchema);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should validate archetype with optional fields', () => {
		const person = {
			name: 'Olive Brockwell',
			age: 42,
			email: 'alice@example.com'
		};

		const result: ValidationResult = validateArchetype(person, personSchema);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});
});
