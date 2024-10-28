import type { StringField } from './schema-field.js';
import type { ValidationError } from './validation-error.js';

const validateStringField = (
	value: unknown,
	field: StringField,
	path: string[] = []
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== 'string') {
		return [
			{
				path,
				message: `Expected string, got ${typeof value}`
			}
		];
	}

	if (field.enum && !field.enum.includes(value as string)) {
		errors.push({
			path,
			message: `Value must be one of: ${field.enum.join(', ')}`
		});
	}

	if (field.pattern && !new RegExp(field.pattern).test(value as string)) {
		errors.push({
			path,
			message: `Value does not match pattern: ${field.pattern}`
		});
	}

	return errors;
};

export default validateStringField;
