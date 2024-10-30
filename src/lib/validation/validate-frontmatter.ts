import type { ArchetypeValidator } from '$types/archetype-validator.js';
import type { ValidationResult } from '$types/validation-result.js';
import validateArchetype from './validate-archetype.js';
import validationError from './validation-error.js';

const validateFrontmatter: (
	frontmatter: unknown,
	validator: ArchetypeValidator
) => Promise<ValidationResult> = async (frontmatter, { loadArchetype }) => {
	if (frontmatter === null || typeof frontmatter !== 'object') {
		return {
			valid: false,
			errors: [validationError('Frontmatter must be an object')]
		};
	}

	const archetypeName =
		'type' in frontmatter && typeof frontmatter.type === 'string' ? frontmatter.type : undefined;

	if (archetypeName === undefined) {
		return {
			valid: false,
			errors: [validationError('Frontmatter must have a `type` field', ['type'])]
		};
	}

	const archetype = await loadArchetype(archetypeName);

	return validateArchetype(frontmatter, archetype);
};

export default validateFrontmatter;
