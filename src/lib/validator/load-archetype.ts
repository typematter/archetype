import type { ArchetypeStore } from '$types/archetype-store.js';
import type { Archetype } from '$types/archetype.js';
import extendArchetype from './extend-archetype.js';

interface LoadOptions {
	cache?: false;
	store: ArchetypeStore;
}

const loadArchetype: (name: string, options: LoadOptions) => Promise<Archetype> = async (
	name,
	{ store }
) => {
	const archetype = await store.load(name);

	const loadedArchetypes = new Map<string, Archetype>();

	const loadArchetypeRecursive = async (names: string[] = []) => {
		for (const name of names) {
			if (loadedArchetypes.has(name)) {
				continue;
			}

			const archetype = await store.load(name);

			loadedArchetypes.set(name, archetype);

			if (archetype.extends) {
				await loadArchetypeRecursive(archetype.extends);
			}
		}
	};

	await loadArchetypeRecursive(archetype.extends);

	return extendArchetype(archetype, Array.from(loadedArchetypes.values()));
};

export default loadArchetype;
