import { bootstrap } from '@accuser/archetype';
import { describe, expect, it } from 'vitest';

describe('bootstrap', () => {
	it('should return an object with a function to load archetypes', async () => {
		const { loadArchetype } = await bootstrap();

		expect(loadArchetype).toBeDefined();
	});

	describe('loadArchetype', () => {
		it('should load a valid archetype', async () => {
			const { loadArchetype } = await bootstrap();

			const archetype = await loadArchetype('archetype');

			expect(archetype).toBeDefined();
		});
	});

	it('should return an object with a function to validate archetypes', async () => {
		const { validateArchetype } = await bootstrap();

		expect(validateArchetype).toBeDefined();
	});

	describe('validateArchetype', () => {
		it('should validate a valid archetype', async () => {
			const { validateArchetype } = await bootstrap();

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
