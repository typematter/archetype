import isUnknownField from './is-unknown-field.js';
import type { ArrayField } from './schema-field.js';

const isArrayField = (field: unknown): field is ArrayField =>
	isUnknownField(field) && field.type === 'Array';

export default isArrayField;
