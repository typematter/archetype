import type { ArchetypeStore } from './archetype-store.js';
import type { StoreOptions } from './store-options.js';

interface ValidatorOptions {
	/**
	 * Store configuration
	 */
	store?: ArchetypeStore | StoreOptions;

	/**
	 * Validation options
	 */
	validation?: {
		strictMode?: boolean;
		allowUnknownFields?: boolean;
	};
}

export type { ValidatorOptions };
