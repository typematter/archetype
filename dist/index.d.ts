import { PathLike } from 'node:fs';

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

interface Archetype {
    /**
     * Unique identifier for this archetype.
     */
    name: string;
    /**
     * Semantic version number.
     */
    version: string;
    /**
     * Schema definition containing required and optional field specifications.
     */
    schema: {
        /**
         * Fields that must be present in content using this archetype.
         */
        required: Record<string, SchemaField>;
        /**
         * Fields that may be present in content using this archetype.
         */
        optional: Record<string, SchemaField>;
    };
    /**
     * Name of parent archetype to inherit from.
     */
    extends?: string;
}

interface ValidationError {
    path: string[];
    message: string;
}

interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

interface ArchetypeEngine {
    readonly archetypeSchema: Readonly<Archetype>;
    readonly loadArchetype: (name: string) => Promise<Archetype>;
    readonly validateArchetype: (archetype: unknown) => ValidationResult;
}

interface BootstrapOptions {
    /**
     * The root directory to load archetypes from.
     */
    root?: PathLike;
}
declare const bootstrap: (options?: BootstrapOptions) => Promise<ArchetypeEngine>;

export { type Archetype, type ArchetypeEngine, type BootstrapOptions, type SchemaField, type ValidationError, type ValidationResult, bootstrap };
