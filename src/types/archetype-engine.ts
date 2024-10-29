import type { Archetype } from './archetype.js';
import type { ValidationResult } from './validation-result.js';

interface ArchetypeEngine {
	readonly archetypeSchema: Readonly<Archetype>;
	readonly loadArchetype: (name: string) => Promise<Archetype>;
	readonly validateArchetype: (archetype: unknown) => ValidationResult;
}

export type { ArchetypeEngine };
