import validateArchetype from '$lib/validation/validate-archetype.js';
import type { ArchetypeStore } from '$types/archetype-store.js';
import type { Archetype } from '$types/archetype.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createValidator from './create-validator.js';

vi.mock('$lib/validation/validate-archetype.js', () => ({
	default: vi.fn()
}));

describe('createValidator', () => {
	const mockArchetype: Archetype = {
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
				extends: {
					type: 'Array',
					items: { type: 'String' }
				}
			}
		}
	};

	const mockPostArchetype: Archetype = {
		name: 'post',
		version: '1.0.0',
		schema: {
			required: {
				title: { type: 'String' },
				content: { type: 'String' }
			},
			optional: {}
		}
	};

	const store: ArchetypeStore = {
		load: (name) =>
			name === 'archetype' ? Promise.resolve(mockArchetype) : Promise.resolve(mockPostArchetype)
	};

	beforeEach(() => {
		vi.mocked(validateArchetype).mockReturnValue({ errors: [], valid: true });
	});

	it('should create a validator with a valid archetype schema', async () => {
		const validator = await createValidator({ store });

		expect(validator.archetypeSchema).toBe(mockArchetype);
		expect(validateArchetype).toHaveBeenCalledWith(mockArchetype, mockArchetype);
	});

	it('should throw an error if the archetype schema is invalid', async () => {
		vi.mocked(validateArchetype).mockReturnValue({
			errors: [{ message: 'mockMessage', path: ['mockPath'] }],
			valid: false
		});

		await expect(createValidator({ store })).rejects.toThrow('Invalid archetype schema');
	});

	it('should validate an archetype', async () => {
		const validator = await createValidator({ store });

		const result = await validator.validateArchetype(mockArchetype);

		expect(result).toEqual({ errors: [], valid: true });
		expect(validateArchetype).toHaveBeenCalledWith(mockArchetype, mockArchetype);
	});

	it('should validate frontmatter against a loaded archetype', async () => {
		const { validateFrontmatter } = await createValidator({ store });

		const result = await validateFrontmatter({
			type: 'post',
			title: 'First Post',
			content: 'Hello, World!'
		});

		expect(result).toEqual({ errors: [], valid: true });
	});
});
