import type { Archetype } from './archetype.js';
import type { SchemaField } from './schema-field.js';
import validateSchemaField from './validate-schema-field.js';
import type { ValidationError } from './validation-error.js';
import type { ValidationResult } from './validation-result.js';

const validateArchetype = (archetype: unknown, archetypeSchema: Archetype): ValidationResult => {
	const errors: ValidationError[] = [];

	for (const [fieldName, fieldSchema] of Object.entries(archetypeSchema.schema.required) as [
		string,
		SchemaField
	][]) {
		const value =
			archetype && typeof archetype === 'object'
				? (archetype as Record<string, unknown>)[fieldName]
				: undefined;

		if (value === undefined) {
			errors.push({
				path: [fieldName],
				message: 'Required field missing'
			});
		} else {
			errors.push(...validateSchemaField(value, fieldSchema, [fieldName]));
		}
	}

	// Then validate optional fields if present
	for (const [fieldName, fieldSchema] of Object.entries(archetypeSchema.schema.optional) as [
		string,
		SchemaField
	][]) {
		const value =
			archetype && typeof archetype === 'object'
				? (archetype as Record<string, unknown>)[fieldName]
				: undefined;

		if (value !== undefined) {
			errors.push(...validateSchemaField(value, fieldSchema, [fieldName]));
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
};

export default validateArchetype;
