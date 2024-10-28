import { describe, expect, it, vi } from 'vitest';
import type { Archetype } from './archetype.js';
import { bootstrapArchetypeValidation } from './bootstrap-archetype-validation.js';
import loadArchetype from './load-archetype.js';
import validateArchetype from './validate-archetype.js';
import type { ValidationResult } from './validation-result.js';

vi.mock('./load-archetype.js');
vi.mock('./validate-archetype.js');

describe('bootstrapArchetypeValidation', () => {
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

		const result = await bootstrapArchetypeValidation();

		expect(result.archetypeSchema).toEqual(archetypeSchema);
		expect(result.loadArchetype).toBeInstanceOf(Function);
		expect(result.validateArchetype).toBeInstanceOf(Function);
	});

	it('should throw an error if the archetype schema is invalid', async () => {
		vi.mocked(loadArchetype).mockResolvedValueOnce(archetypeSchema);
		vi.mocked(validateArchetype).mockReturnValueOnce(invalidValidationResult);

		await expect(bootstrapArchetypeValidation()).rejects.toThrow('Invalid archetype schema');
	});
});
