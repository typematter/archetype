import type { DateField } from '$types/schema-field.js';
import type { ValidationError } from 'src/types/validation-error.js';
import { isValidDate } from './iso8601.js';

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

	if (field.format === 'ISO-8601' && isValidDate(value) === false) {
		errors.push({
			path,
			message: 'Date must be in ISO-8601 format'
		});
	}

	return errors;
};

export default validateDateField;
