import validateArchetype from '$lib/validation/validate-archetype.js';
import type { Archetype } from '$types/archetype.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createValidator from './create-validator.js';

vi.mock('$lib/validation/validate-archetype.js', () => ({
	default: vi.fn()
}));

describe('createValidator', () => {
	const mockStore = {
		load: vi.fn()
	};
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

	beforeEach(() => {
		vi.mocked(mockStore.load).mockResolvedValue(mockArchetype);
		vi.mocked(validateArchetype).mockReturnValue({ errors: [], valid: true });
	});

	it('should create a validator with a valid archetype schema', async () => {
		const validator = await createValidator({ store: mockStore });

		expect(validator.archetypeSchema).toBe(mockArchetype);
		expect(validateArchetype).toHaveBeenCalledWith(mockArchetype, mockArchetype);
	});

	it('should throw an error if the archetype schema is invalid', async () => {
		vi.mocked(validateArchetype).mockReturnValue({
			errors: [{ message: 'mockMessage', path: ['mockPath'] }],
			valid: false
		});

		await expect(createValidator({ store: mockStore })).rejects.toThrow('Invalid archetype schema');
	});

	it('should load an archetype and cache it', async () => {
		const validator = await createValidator({ store: mockStore, cache: true });

		const archetype = await validator.loadArchetype('test-archetype');

		expect(archetype).toBe(mockArchetype);
		expect(mockStore.load).toHaveBeenCalledWith('test-archetype');

		const cachedArchetype = await validator.loadArchetype('test-archetype');

		expect(cachedArchetype).toBe(mockArchetype);
		expect(mockStore.load).toHaveBeenCalledTimes(2);
	});

	it('should validate an archetype', async () => {
		const validator = await createValidator({ store: mockStore });

		const result = await validator.validateArchetype(mockArchetype);

		expect(result).toEqual({ errors: [], valid: true });
		expect(validateArchetype).toHaveBeenCalledWith(mockArchetype, mockArchetype);
	});

	it('should validate frontmatter against a loaded archetype', async () => {
		const validator = await createValidator({ store: mockStore });

		const result = await validator.validateFrontmatter({}, 'test-archetype');

		expect(result).toEqual({ errors: [], valid: true });
		expect(validateArchetype).toHaveBeenCalledWith({}, mockArchetype, {});
	});
});
