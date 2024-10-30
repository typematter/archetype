import { ArchetypeLoadError, type ArchetypeStore } from '$types/archetype-store.js';
import archetypeFromYaml from './archetype-from-yaml.js';
import yamlFromMarkdown from './yaml-from-markdown.js';

/**
 * Error thrown when a remote archetype fails to load.
 */
class RemoteArchetypeLoadError extends ArchetypeLoadError {
	constructor(name: string, statusText: string) {
		super(`Failed to load remote archetype "${name}": ${statusText}`);
		this.name = 'RemoteArchetypeLoadError';
	}
}

/**
 * Fetches an archetype schema from a remote markdown file.
 *
 * @param name - The name of the archetype to load.
 * @param baseUrl - The base URL to load the archetype from.
 * @returns A promise that resolves to the archetype schema.
 * @throws {RemoteArchetypeLoadError} If the archetype schema could not be loaded
 */
const fetchMarkdown: (name: string, baseUrl: string | URL) => Promise<string> = async (
	name,
	baseUrl
) => {
	try {
		const url = new URL(`${name}.md`, baseUrl);
		const res = await fetch(url);

		if (res.ok) {
			return res.text();
		} else {
			throw new RemoteArchetypeLoadError(name, res.statusText);
		}
	} catch (error) {
		throw error instanceof RemoteArchetypeLoadError ? error : new ArchetypeLoadError(name, error);
	}
};

/**
 * Creates a store that loads archetype schemas from remote markdown files.
 *
 * @param baseUrl - The base URL to load the archetype from.
 * @returns A store that loads archetype schemas from remote markdown files.
 * @throws {RemoteArchetypeLoadError} If the archetype schema could not be loaded
 */
const createRemoteStore: (baseUrl: string | URL) => ArchetypeStore = (baseUrl) => ({
	load: (name) => fetchMarkdown(name, baseUrl).then(yamlFromMarkdown).then(archetypeFromYaml)
});

export { createRemoteStore as default, RemoteArchetypeLoadError };
