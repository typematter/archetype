import type { Archetype } from './archetype.js';
import type { ValidationResult } from './validation-result.js';

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

export type { ArchetypeValidator };
