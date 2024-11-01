import { ArchetypeStore, createValidator } from '@typematter/archetype';
import { describe, expect, it } from 'vitest';

const mockArchetype = {
	name: 'archetype',
	version: '1.0.0',
	schema: {
		required: {
			name: { type: 'String' as const },
			version: { type: 'String' as const },
			schema: {
				type: 'Object' as const,
				properties: {
					required: { type: 'Object' as const },
					optional: { type: 'Object' as const }
				}
			}
		},
		optional: {
			extends: { type: 'Array' as const, items: { type: 'String' as const } }
		}
	}
};

const mockPostArchetype = {
	name: 'post',
	version: '1.0.0',
	extends: ['taggable'],
	schema: {
		required: {
			title: { type: 'String' as const }
		},
		optional: {
			author: { type: 'String' as const }
		}
	}
};

const mockTaggableArchetype = {
	name: 'taggable',
	version: '1.0.0',
	schema: {
		required: {
			tags: { type: 'Array' as const, items: { type: 'String' as const } }
		},
		optional: {}
	}
};

const store: ArchetypeStore = {
	load: (name) => {
		if (name === 'archetype') return Promise.resolve(mockArchetype);
		if (name === 'post') return Promise.resolve(mockPostArchetype);
		if (name === 'taggable') return Promise.resolve(mockTaggableArchetype);
		throw new Error(`Archetype "${name}" not found`);
	}
};

describe('createValidator', () => {
	it('should return an object with an `archetypeSchema` field', async () => {
		const { archetypeSchema } = await createValidator({ store });

		expect(archetypeSchema).toBeDefined();
	});

	describe('archetypeSchema', () => {
		it('should be loaded automatically', async () => {
			const { archetypeSchema } = await createValidator({ store });

			expect(archetypeSchema).toBe(mockArchetype);
		});
	});

	it('should return an object with a function to load archetypes', async () => {
		const { loadArchetype } = await createValidator({ store });

		expect(loadArchetype).toBeDefined();
	});

	describe('loadArchetype', () => {
		it('should load a valid archetype', async () => {
			const { loadArchetype } = await createValidator({ store });

			const archetype = await loadArchetype('archetype');

			expect(archetype).toBeDefined();
		});

		it('should load a valid archetype with extensions', async () => {
			const { loadArchetype } = await createValidator({ store });

			const archetype = await loadArchetype('post');

			expect(archetype).toBeDefined();
		});
	});

	it('should return an object with a function to validate archetypes', async () => {
		const { validateArchetype } = await createValidator({ store });

		expect(validateArchetype).toBeDefined();
	});

	describe('validateArchetype', () => {
		it('should validate a valid archetype', async () => {
			const { validateArchetype } = await createValidator({ store });

			const result = await validateArchetype(mockPostArchetype);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	it('should return an object with a function to validate frontmatter', async () => {
		const { validateFrontmatter } = await createValidator({ store });

		expect(validateFrontmatter).toBeDefined();
	});

	describe('validateFrontmatter', () => {
		it('should validate a valid frontmatter', async () => {
			const { validateFrontmatter } = await createValidator({ store });

			const frontmatter = {
				type: 'post',
				title: 'First Post',
				tags: ['first', 'post']
			};

			const result = await validateFrontmatter(frontmatter);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});
});
