import isUnknownField from './is-unknown-field.js';
import type { DateField } from './schema-field.js';

const isDateField = (field: unknown): field is DateField =>
	isUnknownField(field) && field.type === 'Date';

export default isDateField;
