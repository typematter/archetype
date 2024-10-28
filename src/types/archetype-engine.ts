import type { Archetype } from './archetype.js';
import type { ValidationResult } from './validation-result.js';

interface ArchetypeEngine {
	archetypeSchema: Archetype;
	loadArchetype: (name: string) => Promise<Archetype>;
	validateArchetype: (archetype: unknown) => ValidationResult;
}

export type { ArchetypeEngine };
