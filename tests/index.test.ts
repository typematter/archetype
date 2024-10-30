import { ArchetypeStore, createValidator } from '@accuser/archetype';
import { describe, expect, it, vi } from 'vitest';

const mockSchema = {
	name: 'archetype',
	version: '1.0.0',
	schema: {
		required: {
			name: { type: 'String' },
			version: { type: 'String' },
			schema: {
				type: 'Object',
				properties: {
					required: { type: 'Object' },
					optional: { type: 'Object' }
				}
			}
		},
		optional: {
			extends: { type: 'String' }
		}
	}
};

const store: ArchetypeStore = {
	load: vi.fn().mockResolvedValue(mockSchema)
};

describe('createValidator', () => {
	it('should return an object with an `archetypeSchema` field', async () => {
		const { archetypeSchema } = await createValidator({ store });

		expect(archetypeSchema).toBeDefined();
	});

	describe('archetypeSchema', () => {
		it('should be loaded automatically', async () => {
			const { archetypeSchema } = await createValidator({ store });

			expect(archetypeSchema).toBe(mockSchema);
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
	});

	it('should return an object with a function to validate archetypes', async () => {
		const { validateArchetype } = await createValidator({ store });

		expect(validateArchetype).toBeDefined();
	});

	describe('validateArchetype', () => {
		it('should validate a valid archetype', async () => {
			const { validateArchetype } = await createValidator({ store });

			const person = {
				name: 'person',
				version: '1.0.0',
				schema: {
					required: {
						name: { type: 'String' },
						age: { type: 'Number' }
					},
					optional: {
						email: { type: 'String' }
					}
				}
			};

			const result = validateArchetype(person);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});
});
