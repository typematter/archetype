import type { ArchetypeStore } from './archetype-store.js';

interface ValidatorOptions {
	/**
	 * Where to load archetypes from
	 */
	store: ArchetypeStore;

	/**
	 * Validation options
	 */
	validation?: {
		strictMode?: boolean;
		allowUnknownFields?: boolean;
	};
}

export type { ValidatorOptions };
