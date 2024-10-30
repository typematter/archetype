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
	 * Name(s) of archetype(s) this archetype extends.
	 */
	extends?: string[];
}

export type { Archetype };
