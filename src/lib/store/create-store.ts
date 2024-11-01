import archetypeFromContent from '$lib/pipelines/archetype-from-content.js';
import { ArchetypeLoadError, type ArchetypeStore } from '$types/archetype-store.js';
import type { Archetype } from '$types/archetype.js';
import type { StoreOptions } from '$types/store-options.js';
import { compose, resolve, type PipelineStage } from '@typematter/pipeline';
import { DEV } from 'esm-env';

const createStore: (loadContent: PipelineStage, options?: StoreOptions) => ArchetypeStore = (
	loadContent,
	{ cache = !DEV } = {}
) => {
	const loadArchetype = compose(loadContent, archetypeFromContent);

	const archetypeCache = cache ? new Map<string, Archetype>() : undefined;

	return {
		load: async (name) => {
			if (archetypeCache?.has(name)) {
				return archetypeCache.get(name)!;
			}

			try {
				const { archetype } = await loadArchetype({ name }).then(resolve);

				if (archetype === undefined || archetype === null) {
					throw 'Failed to load archetype';
				}

				if (cache) {
					archetypeCache?.set(name, archetype);
				}

				return archetype;
			} catch (error) {
				throw new ArchetypeLoadError(
					name,
					error instanceof Error ? error : new Error(String(error))
				);
			}
		}
	};
};

export { createStore as default };
