import createStore from '$lib/store/create-store.js';
import validateArchetype from '$lib/validation/validate-archetype.js';
import validateFrontmatter from '$lib/validation/validate-frontmatter.js';
import type { ArchetypeValidator } from '$types/archetype-validator.js';
import type { Archetype } from '$types/archetype.js';
import type { ValidatorOptions } from '$types/validator-options.js';
import extendArchetype from './extend-archetype.js';

/**
 * Creates and initializes an ArchetypeValidator instance.
 *
 * @param options - Configuration options for the validator.
 * @param options.store - The data store used to load archetype schemas.
 * @param options.cache - Determines whether to cache loaded archetypes. Defaults to `true` in test and production environments.
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
const createValidator: (options?: ValidatorOptions) => Promise<ArchetypeValidator> = async ({
	store: _store = createStore(),
	validation: { strictMode = false, allowUnknownFields = false } = {}
} = {}) => {
	const store =
		typeof _store === 'object' ? ('load' in _store ? _store : createStore(_store)) : undefined;

	if (store === undefined) {
		throw new Error('Invalid store configuration');
	}

	void strictMode;
	void allowUnknownFields;

	const archetypeSchema = await store.load('archetype');

	const { errors, valid } = validateArchetype(archetypeSchema, archetypeSchema);

	if (!valid) {
		throw new Error('Invalid archetype schema', { cause: errors });
	}

	const validator: ArchetypeValidator = {
		archetypeSchema,

		loadArchetype: async (name) => {
			const archetype = await store.load(name);

			const loadedArchetypes = new Map<string, Archetype>();

			const loadArchetypeRecursive = async (names: string[] = []) => {
				for (const name of names) {
					if (loadedArchetypes.has(name)) {
						continue;
					}

					const archetype = await store.load(name);

					loadedArchetypes.set(name, archetype);

					if (archetype.extends) {
						await loadArchetypeRecursive(archetype.extends);
					}
				}
			};

			await loadArchetypeRecursive(archetype.extends);

			return extendArchetype(archetype, Array.from(loadedArchetypes.values()));
		},

		validateArchetype: async (archetype) => validateArchetype(archetype, archetypeSchema),

		validateFrontmatter: async (frontmatter) => validateFrontmatter(frontmatter, validator)
	};

	return validator;
};

export default createValidator;
