import isUnknownField from './is-unknown-field.js';
import type { ObjectField } from './schema-field.js';

const isObjectField = (field: unknown): field is ObjectField =>
	isUnknownField(field) && field.type === 'Object';

export default isObjectField;
