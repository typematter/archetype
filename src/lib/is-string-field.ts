import isUnknownField from './is-unknown-field.js';
import type { StringField } from './schema-field.js';

const isStringField = (field: unknown): field is StringField =>
	isUnknownField(field) && field.type === 'String';

export default isStringField;
