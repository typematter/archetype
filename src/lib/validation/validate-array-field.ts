import type { ArrayField } from '$types/schema-field.js';
import type { ValidationError } from 'src/types/validation-error.js';
import validateSchemaField from './validate-schema-field.js';

const validateArrayField = (
	value: unknown,
	field: ArrayField,
	path: string[] = []
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!Array.isArray(value)) {
		return [
			{
				path,
				message: `Expected array, got ${typeof value}`
			}
		];
	}

	if (field.minItems !== undefined && value.length < field.minItems) {
		errors.push({
			path,
			message: `Array must contain at least ${field.minItems} items`
		});
	}

	if (field.maxItems !== undefined && value.length > field.maxItems) {
		errors.push({
			path,
			message: `Array must contain at most ${field.maxItems} items`
		});
	}

	value.forEach((item, index) => {
		errors.push(...validateSchemaField(item, field.items, [...path, index.toString()]));
	});

	return errors;
};

export default validateArrayField;
