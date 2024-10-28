import type { ObjectField } from '$types/schema-field.js';
import type { ValidationError } from 'src/types/validation-error.js';
import validateSchemaField from './validate-schema-field.js';

const validateObjectField = (
	value: unknown,
	field: ObjectField,
	path: string[] = []
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== 'object' || value === null) {
		return [
			{
				path,
				message: `Expected object, got ${typeof value}`
			}
		];
	}

	const valueObj = value as Record<string, unknown>;

	field.required?.forEach((requiredProp) => {
		if (!(requiredProp in valueObj)) {
			errors.push({
				path: [...path, requiredProp],
				message: 'Required property missing'
			});
		}
	});

	if (field.properties) {
		Object.entries(field.properties).forEach(([key, propSchema]) => {
			if (key in valueObj) {
				errors.push(...validateSchemaField(valueObj[key], propSchema, [...path, key]));
			}
		});
	}

	return errors;
};

export default validateObjectField;
