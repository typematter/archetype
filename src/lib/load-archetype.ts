import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import type { Archetype } from './archetype.js';

const loadArchetype: (name: string, path: string) => Promise<Archetype> = async (name, path) => {
	const filename = join(path, `${name}.md`);

	const text = await readFile(filename, 'utf-8');
	const [, yaml] = text.split('---\n');

	if (yaml) {
		return parse(yaml) as Archetype;
	}

	throw new Error('YAML content is missing in the file');
};

export default loadArchetype;
