import type { Loader } from './loader.js';

interface StoreOptions {
	/**
	 * Cache loaded archetypes
	 */
	cache?: boolean;

	/**
	 * Load strategies to use
	 */
	loaders?: Loader[];
}

export type { StoreOptions };
