import type { Archetype } from './archetype.js';

class ArchetypeLoadError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'ArchetypeLoadError';
		this.cause = cause;
	}
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

export { ArchetypeLoadError, type ArchetypeStore };
