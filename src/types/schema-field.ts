interface UnknownField {
	type: string;
	description?: string;
}

interface ArrayField extends UnknownField {
	type: 'Array';
	items: SchemaField;
	minItems?: number;
	maxItems?: number;
	default?: unknown[];
}

interface BooleanField extends UnknownField {
	type: 'Boolean';
	default?: boolean;
}

interface DateField extends UnknownField {
	type: 'Date';
	format?: 'ISO-8601';
	default?: string;
}

interface NumberField extends UnknownField {
	type: 'Number';
	min?: number;
	max?: number;
	default?: number;
}

interface ObjectField extends UnknownField {
	type: 'Object';
	properties?: Record<string, SchemaField>;
	required?: string[];
	default?: Record<string, unknown>;
}

interface StringField extends UnknownField {
	type: 'String';
	pattern?: string;
	enum?: string[];
	default?: string;
}

interface SchemaFieldMap {
	Array: ArrayField;
	Boolean: BooleanField;
	Date: DateField;
	Number: NumberField;
	Object: ObjectField;
	String: StringField;
}

type SchemaField = SchemaFieldMap[keyof SchemaFieldMap];

export type {
	ArrayField,
	BooleanField,
	DateField,
	NumberField,
	ObjectField,
	SchemaField,
	SchemaFieldMap,
	StringField,
	UnknownField
};
