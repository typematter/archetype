import type { NumberField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isNumberField = (field: unknown): field is NumberField =>
	isUnknownField(field) && field.type === 'Number';

export default isNumberField;
