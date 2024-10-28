import type { DateField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isDateField = (field: unknown): field is DateField =>
	isUnknownField(field) && field.type === 'Date';

export default isDateField;
