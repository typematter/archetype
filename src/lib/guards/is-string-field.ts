import type { StringField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isStringField = (field: unknown): field is StringField =>
	isUnknownField(field) && field.type === 'String';

export default isStringField;
