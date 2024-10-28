import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { describe, expect, it, vi, type Mock } from 'vitest';
import loadArchetype from './load-archetype.js';

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn()
}));

describe('loadArchetype', () => {
	const root = join(cwd(), 'data', 'archetypes');
	const archetypeName = 'tutorial';
	const archetypeContent = '---\ntitle: Tutorial\n---\nContent here';

	it('should load and parse the archetype file', async () => {
		(readFile as Mock).mockResolvedValue(archetypeContent);

		const result = await loadArchetype(archetypeName, root);

		expect(readFile).toHaveBeenCalledWith(join(root, `${archetypeName}.md`), 'utf-8');

		expect(result).toEqual({ title: 'Tutorial' });
	});

	it('should throw an error if the archetype content is invalid', async () => {
		(readFile as Mock).mockResolvedValue('Invalid content');

		await expect(loadArchetype(archetypeName, root)).rejects.toThrow(
			'YAML content is missing in the file'
		);
	});
});
