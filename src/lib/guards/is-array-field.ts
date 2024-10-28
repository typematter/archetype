import type { ArrayField } from '$types/schema-field.js';
import isUnknownField from './is-unknown-field.js';

const isArrayField = (field: unknown): field is ArrayField =>
	isUnknownField(field) && field.type === 'Array';

export default isArrayField;
