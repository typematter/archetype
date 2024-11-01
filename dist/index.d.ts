import { PipelineStage } from '@typematter/pipeline';

declare module '@typematter/pipeline' {
    interface PipelineContext {
        content?: string;
        name?: string;
    }
}
declare const createLocalLoader: (path: string) => PipelineStage;

declare module '@typematter/pipeline' {
    interface PipelineContext {
        content?: string;
        name?: string;
    }
}
declare const createRemoteLoader: (baseUrl: string | URL) => PipelineStage;

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
     * Name(s) of archetype(s) this archetype extends.
     */
    extends?: string[];
}

declare class ArchetypeLoadError extends Error {
    constructor(message: string, cause?: unknown);
}
interface ArchetypeStore {
    /**
     * Load an archetype schema by name.
     *
     * @param name - The name of the archetype to load.
     * @returns A promise that resolves to the loaded archetype schema.
     *
     * @throws {ArchetypeLoadError} If the archetype schema could not be loaded
     *
     * @example
     * const archetype = await store.load('post');
     */
    load(name: string): Promise<Archetype>;
}

interface StoreOptions {
    /**
     * Cache loaded archetypes
     */
    cache?: boolean;
}

declare const createStore: (loadContent: PipelineStage, options?: StoreOptions) => ArchetypeStore;

interface ValidationError {
    path: string[];
    message: string;
}

interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

interface LoadOptions {
    /**
     * Override the cache setting for this load. If not provided, the default
     * cache setting will be used.
     */
    cache?: false;
}
interface ArchetypeValidator {
    /**
     * The base archetype schema that all other archetypes must conform to
     */
    readonly archetypeSchema: Readonly<Archetype>;
    /**
     * Load an archetype by name from the configured store
     */
    readonly loadArchetype: (name: string, options?: LoadOptions) => Promise<Archetype>;
    /**
     * Validate an archetype definition against the base archetype schema
     */
    readonly validateArchetype: (archetype: unknown) => Promise<ValidationResult>;
    /**
     * Validate frontmatter
     */
    readonly validateFrontmatter: (frontmatter: unknown) => Promise<ValidationResult>;
}

interface ValidatorOptions {
    /**
     * Where to load archetypes from
     */
    store: ArchetypeStore;
    /**
     * Validation options
     */
    validation?: {
        strictMode?: boolean;
        allowUnknownFields?: boolean;
    };
}

/**
 * Creates and initializes an ArchetypeValidator instance.
 *
 * @param options - Configuration options for the validator.
 * @param options.store - The data store used to load archetype schemas.
 * @param options.cache - Determines whether to cache loaded archetypes. Defaults to `true` in test and production environments.
 * @param options.validation - Additional validation options to apply. Defaults to an empty object.
 * @returns A promise that resolves to an initialized ArchetypeValidator.
 *
 * @throws {Error} If the initial archetype schema is invalid.
 *
 * @example
 * const validator = await createValidator({
 *     store: createLocalStore(path.join(process.cwd(), 'data', 'archetypes')),
 * });
 */
declare const createValidator: (options: ValidatorOptions) => Promise<ArchetypeValidator>;

export { type Archetype, ArchetypeLoadError, type ArchetypeStore, type ArchetypeValidator, type SchemaField, type ValidationError, type ValidationResult, type ValidatorOptions, createLocalLoader, createRemoteLoader, createStore, createValidator };
