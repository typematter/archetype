import type { DateField } from './schema-field.js';
import type { ValidationError } from './validation-error.js';

const validateDateField = (
	value: unknown,
	field: DateField,
	path: string[] = []
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== 'string' || isNaN(Date.parse(value))) {
		return [
			{
				path,
				message: 'Invalid date format'
			}
		];
	}

	if (field.format === 'ISO-8601' && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
		errors.push({
			path,
			message: 'Date must be in ISO-8601 format'
		});
	}

	return errors;
};

export default validateDateField;
