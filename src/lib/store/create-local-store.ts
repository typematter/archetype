import { ArchetypeLoadError, type ArchetypeStore } from '$types/archetype-store.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import archetypeFromYaml from './archetype-from-yaml.js';
import yamlFromMarkdown from './yaml-from-markdown.js';

/**
 * Error thrown when a local archetype fails to load.
 */
class LocalArchetypeLoadError extends ArchetypeLoadError {
	constructor(name: string, originalError: Error) {
		super(`Failed to load local archetype "${name}": ${originalError.message}`);
		this.name = 'LocalArchetypeLoadError';
		this.stack = originalError.stack;
	}
}

/**
 * Loads an archetype schema from a markdown file.
 *
 * @param name - The name of the archetype to load.
 * @param path - The path to the directory containing the archetype.
 * @returns A promise that resolves to the archetype schema.
 * @throws {LocalArchetypeLoadError} If the archetype schema could not be loaded
 */
const loadMarkdown: (name: string, path: string) => Promise<string> = (name, path) =>
	readFile(join(path, `${name}.md`), 'utf-8').catch((error) => {
		throw new LocalArchetypeLoadError(
			name,
			error instanceof Error ? error : new Error(String(error))
		);
	});

/**
 * Creates a store that loads archetype schemas from local markdown files.
 *
 * @param root - The root directory containing the archetype schemas.
 * @returns A store that loads archetype schemas from local markdown files.
 * @throws {LocalArchetypeLoadError} If the archetype schema could not be loaded
 */
const createLocalStore: (root: string) => ArchetypeStore = (root) => ({
	load: (name) => loadMarkdown(name, root).then(yamlFromMarkdown).then(archetypeFromYaml)
});

export { createLocalStore as default, LocalArchetypeLoadError };
