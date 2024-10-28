import type { ObjectField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isObjectField = (field: unknown): field is ObjectField =>
	isUnknownField(field) && field.type === 'Object';

export default isObjectField;
