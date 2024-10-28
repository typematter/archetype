import type { ArchetypeEngine } from '$types/archetype-engine.js';
import type { PathLike } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import loadArchetype from './loading/load-archetype.js';
import validateArchetype from './validation/validate-archetype.js';

interface BootstrapOptions {
	/**
	 * The root directory to load archetypes from.
	 */
	root?: PathLike;
}

const bootstrap: (options?: BootstrapOptions) => Promise<ArchetypeEngine> = async ({
	root = join(cwd(), 'data', 'archetypes')
} = {}) => {
	const archetypeSchema = await loadArchetype('archetype', root.toString());

	const { errors, valid } = validateArchetype(archetypeSchema, archetypeSchema);

	if (errors.length === 0 && valid) {
		return {
			archetypeSchema,
			loadArchetype: (name: string) => loadArchetype(name, root.toString()),
			validateArchetype: (archetype: unknown) => validateArchetype(archetype, archetypeSchema)
		};
	}

	throw new Error('Invalid archetype schema', { cause: errors });
};

export default bootstrap;
export type { BootstrapOptions };
