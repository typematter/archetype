import type { PathLike } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type { Archetype } from './archetype.js';
import loadArchetype from './load-archetype.js';
import validateArchetype from './validate-archetype.js';
import type { ValidationResult } from './validation-result.js';

interface Options {
	/**
	 * The root directory to load archetypes from.
	 */
	root?: PathLike;
}

export const bootstrapArchetypeValidation: (options?: Options) => Promise<{
	archetypeSchema: Archetype;
	loadArchetype: (name: string) => Promise<Archetype>;
	validateArchetype: (archetype: unknown) => ValidationResult;
}> = async ({ root = join(cwd(), 'data', 'archetypes') } = {}) => {
	const archetypeSchema = await loadArchetype('archetype', root.toString());

	if (!validateArchetype(archetypeSchema, archetypeSchema).valid) {
		throw new Error('Invalid archetype schema');
	}

	return {
		archetypeSchema,
		loadArchetype: (name: string) => loadArchetype(name, root.toString()),
		validateArchetype: (archetype: unknown) => validateArchetype(archetype, archetypeSchema)
	};
};

export default bootstrapArchetypeValidation;
