import type { Archetype } from '$types/archetype.js';
import type { ValidationResult } from '$types/validation-result.js';
import { describe, expect, it, vi } from 'vitest';
import bootstrap from './bootstrap.js';
import loadArchetype from './loading/load-archetype.js';
import validateArchetype from './validation/validate-archetype.js';

vi.mock('./loading/load-archetype.js');
vi.mock('./validation/validate-archetype.js');

describe('bootstrap', () => {
	const archetypeSchema: Archetype = {
		name: 'archetype',
		version: '1.0.0',
		schema: {
			required: {
				name: { type: 'String' },
				version: { type: 'String' },
				schema: { type: 'Object' }
			},
			optional: {
				extends: { type: 'String' }
			}
		}
	};

	const validValidationResult: ValidationResult = { valid: true, errors: [] };

	const invalidValidationResult: ValidationResult = {
		valid: false,
		errors: [{ path: ['name'], message: 'Required field missing' }]
	};

	it('should bootstrap the archetype validation system successfully', async () => {
		vi.mocked(loadArchetype).mockResolvedValueOnce(archetypeSchema);
		vi.mocked(validateArchetype).mockReturnValueOnce(validValidationResult);

		const result = await bootstrap();

		expect(result.archetypeSchema).toEqual(archetypeSchema);
		expect(result.loadArchetype).toBeInstanceOf(Function);
		expect(result.validateArchetype).toBeInstanceOf(Function);
	});

	it('should throw an error if the archetype schema is invalid', async () => {
		vi.mocked(loadArchetype).mockResolvedValueOnce(archetypeSchema);
		vi.mocked(validateArchetype).mockReturnValueOnce(invalidValidationResult);

		await expect(bootstrap()).rejects.toThrow('Invalid archetype schema');
	});
});
