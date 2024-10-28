import isUnknownField from './is-unknown-field.js';
import type { BooleanField } from './schema-field.js';

const isBooleanField = (field: unknown): field is BooleanField =>
	isUnknownField(field) && field.type === 'Boolean';

export default isBooleanField;
