import type { SchemaField } from '$types/schema-field.js';
import type { ValidationError } from '$types/validation-error.js';
import validators from './validators.js';

const validateSchemaField: (
	value: unknown,
	field: SchemaField,
	path?: string[]
) => ValidationError[] = (value, field, path = []) => {
	const validator = validators[field.type];

	if (validator) {
		return validator(value, field as never, path);
	}

	throw new Error(`No validator found for type: ${field.type}`);
};

export default validateSchemaField;
