import type { Archetype } from './archetype.js';
import type { ValidationResult } from './validation-result.js';

interface ArchetypeValidator {
	/**
	 * The base archetype schema that all other archetypes must conform to
	 */
	readonly archetypeSchema: Readonly<Archetype>;

	/**
	 * Load an archetype by name from the configured store
	 */
	readonly loadArchetype: (name: string) => Promise<Archetype>;

	/**
	 * Validate an archetype definition against the base archetype schema
	 */
	readonly validateArchetype: (archetype: unknown) => ValidationResult;

	/**
	 * Validate frontmatter against a named archetype
	 */
	readonly validateFrontmatter: (
		frontmatter: unknown,
		archetypeName: string
	) => Promise<ValidationResult>;
}

export type { ArchetypeValidator };
