import validateArchetype from '$lib/validation/validate-archetype.js';
import type { ArchetypeValidator } from '$types/archetype-validator.js';
import type { Archetype } from '$types/archetype.js';
import type { ValidatorOptions } from '$types/validator-options.js';

/**
 * Creates and initializes an ArchetypeValidator instance.
 *
 * @param options - Configuration options for the validator.
 * @param options.store - The data store used to load archetype schemas.
 * @param options.cache - Determines whether to cache loaded archetypes. Defaults to `true`.
 * @param options.validation - Additional validation options to apply. Defaults to an empty object.
 * @returns A promise that resolves to an initialized ArchetypeValidator.
 *
 * @throws {Error} If the initial archetype schema is invalid.
 *
 * @example
 * const validator = await createValidator({
 *     store: createLocalStore(path.join(process.cwd(), 'data', 'archetypes')),
 * });
 */
const createValidator: (options: ValidatorOptions) => Promise<ArchetypeValidator> = async ({
	store,
	cache = true,
	validation = {}
}) => {
	const archetypeCache = cache ? new Map<string, Archetype>() : undefined;

	const archetypeSchema = await store.load('archetype');

	const { errors, valid } = validateArchetype(archetypeSchema, archetypeSchema);

	if (!valid) {
		throw new Error('Invalid archetype schema', { cause: errors });
	}

	const validator: ArchetypeValidator = {
		archetypeSchema,

		async loadArchetype(name: string) {
			if (archetypeCache?.has(name)) {
				return archetypeCache.get(name)!;
			}

			const archetype = await store.load(name);

			archetypeCache?.set(name, archetype);

			return archetype;
		},

		validateArchetype(archetype: unknown) {
			return validateArchetype(archetype, archetypeSchema);
		},

		async validateFrontmatter(frontmatter: unknown, defaultArchetypeName?: string) {
			if (frontmatter === null || typeof frontmatter !== 'object') {
				return {
					valid: false,
					errors: [
						{
							message: 'Frontmatter must be an object',
							path: []
						}
					]
				};
			}

			const archetypeName =
				'type' in frontmatter && typeof frontmatter.type === 'string'
					? frontmatter.type
					: defaultArchetypeName;

			if (archetypeName === undefined) {
				return {
					valid: false,
					errors: [
						{
							message: 'Frontmatter must have a `type` field',
							path: ['type']
						}
					]
				};
			}

			const archetype = await validator.loadArchetype(archetypeName);

			return validateArchetype(frontmatter, archetype, validation);
		}
	};

	return validator;
};

export default createValidator;
