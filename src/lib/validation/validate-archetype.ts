import type { Archetype } from '$types/archetype.js';
import type { SchemaField } from '$types/schema-field.js';
import type { ValidationResult } from '$types/validation-result.js';
import type { ValidatorOptions } from '$types/validator-options.js';
import type { ValidationError } from 'src/types/validation-error.js';
import validateSchemaField from './validate-schema-field.js';

const validateArchetype: (
	archetype: unknown,
	archetypeSchema: Archetype,
	options?: ValidatorOptions['validation']
) => ValidationResult = (
	archetype,
	archetypeSchema,
	{ strictMode = true, allowUnknownFields = false } = {}
) => {
	const errors: ValidationError[] = [];

	void strictMode;
	void allowUnknownFields;

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
