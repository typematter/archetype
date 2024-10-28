import isArrayField from './is-array-field.js';
import isBooleanField from './is-boolean-field.js';
import isDateField from './is-date-field.js';
import isNumberField from './is-number-field.js';
import isObjectField from './is-object-field.js';
import isStringField from './is-string-field.js';
import type { UnknownField } from './schema-field.js';
import validateArrayField from './validate-array-field.js';
import validateBooleanField from './validate-boolean-field.js';
import validateDateField from './validate-date-field.js';
import validateNumberField from './validate-number-field.js';
import validateObjectField from './validate-object-field.js';
import validateStringField from './validate-string-field.js';
import type { ValidationError } from './validation-error.js';

const validateSchemaField = (
	value: unknown,
	field: UnknownField,
	path: string[] = []
): ValidationError[] => {
	if (isStringField(field)) {
		return validateStringField(value, field, path);
	} else if (isNumberField(field)) {
		return validateNumberField(value, field, path);
	} else if (isBooleanField(field)) {
		return validateBooleanField(value, field, path);
	} else if (isDateField(field)) {
		return validateDateField(value, field, path);
	} else if (isArrayField(field)) {
		return validateArrayField(value, field, path);
	} else if (isObjectField(field)) {
		return validateObjectField(value, field, path);
	} else {
		throw new Error(`Unknown field type: ${field.type}`);
	}
};

export default validateSchemaField;
