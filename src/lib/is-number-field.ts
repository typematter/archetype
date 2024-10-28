import isUnknownField from './is-unknown-field.js';
import type { NumberField } from './schema-field.js';

const isNumberField = (field: unknown): field is NumberField =>
	isUnknownField(field) && field.type === 'Number';

export default isNumberField;
