import type { Loader } from '$types/loader.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';

/**
 * Load an archetype by name from the project's `data/archetypes` directory.
 */
const nameLoader: Loader = {
	canHandle: (path) => path.toString().match(/^[\w][\w-]*$/) !== null,
	load: (path) => {
		const filename = join(cwd(), 'data', 'archetypes', `${path.toString()}.md`);

		return readFile(filename, 'utf-8');
	}
};

export default nameLoader;
