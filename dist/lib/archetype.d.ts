import type { SchemaField } from './schema-field.js';
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
export type { Archetype };
//# sourceMappingURL=archetype.d.ts.map