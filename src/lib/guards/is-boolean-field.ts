import type { BooleanField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isBooleanField = (field: unknown): field is BooleanField =>
	isUnknownField(field) && field.type === 'Boolean';

export default isBooleanField;
