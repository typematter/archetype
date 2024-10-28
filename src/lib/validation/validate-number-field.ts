import type { NumberField } from '$types/schema-field.js';
import type { ValidationError } from 'src/types/validation-error.js';

const validateNumberField = (
	value: unknown,
	field: NumberField,
	path: string[] = []
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== 'number') {
		return [
			{
				path,
				message: `Expected number, got ${typeof value}`
			}
		];
	}

	if (field.min !== undefined && value < field.min) {
		errors.push({
			path,
			message: `Value must be >= ${field.min}`
		});
	}

	if (field.max !== undefined && value > field.max) {
		errors.push({
			path,
			message: `Value must be <= ${field.max}`
		});
	}

	return errors;
};

export default validateNumberField;
