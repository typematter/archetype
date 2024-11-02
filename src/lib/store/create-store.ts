import archetypeFromContent from '$lib/pipelines/archetype-from-content.js';
import { ArchetypeLoadError, type ArchetypeStore } from '$types/archetype-store.js';
import type { Archetype } from '$types/archetype.js';
import type { StoreOptions } from '$types/store-options.js';
import { compose, resolve } from '@typematter/pipeline';
import { DEV } from 'esm-env';
import type { PathLike } from 'fs';
import createLoadContent from './create-load-content.js';

const createStore: (options?: StoreOptions) => ArchetypeStore = ({
	cache = !DEV,
	loaders
} = {}) => {
	const loadArchetype = compose(createLoadContent(loaders), archetypeFromContent);
	const archetypeCache = cache ? new Map<string, Archetype>() : undefined;

	return {
		load: async (path: PathLike) => {
			const name = path.toString();

			if (archetypeCache?.has(name)) {
				return archetypeCache.get(name)!;
			}

			try {
				const { archetype } = await loadArchetype({ path }).then(resolve);

				if (archetype === undefined || archetype === null) {
					throw 'Failed to load archetype';
				}

				if (cache) {
					archetypeCache?.set(name, archetype);
				}

				return archetype;
			} catch (error) {
				throw typeof error === 'string'
					? new ArchetypeLoadError(error)
					: new ArchetypeLoadError(`Error loading ${name}`, error);
			}
		}
	};
};

export { createStore as default };
