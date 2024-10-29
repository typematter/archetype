import type { SchemaFieldMap } from '$types/schema-field.js';
import type { ValidationError } from '$types/validation-error.js';
import validateArrayField from './validate-array-field.js';
import validateBooleanField from './validate-boolean-field.js';
import validateDateField from './validate-date-field.js';
import validateNumberField from './validate-number-field.js';
import validateObjectField from './validate-object-field.js';
import validateStringField from './validate-string-field.js';

type Validators = {
	[K in keyof SchemaFieldMap]: (
		value: unknown,
		field: SchemaFieldMap[K],
		path: string[]
	) => ValidationError[];
};

const validators: Validators = {
	Array: validateArrayField,
	Boolean: validateBooleanField,
	Date: validateDateField,
	Number: validateNumberField,
	Object: validateObjectField,
	String: validateStringField
};

export default validators;
