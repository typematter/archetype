import type { UnknownField } from './schema-field.js';

const isUnknownField = (field: unknown): field is UnknownField =>
	field !== undefined &&
	field !== null &&
	typeof field === 'object' &&
	'type' in field &&
	typeof field.type === 'string';

export default isUnknownField;
