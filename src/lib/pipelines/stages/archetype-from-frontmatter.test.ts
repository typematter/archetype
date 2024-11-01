import { type PipelineContext } from '@typematter/pipeline';
import { describe, expect, it } from 'vitest';
import archetypeFromFrontmatter from './archetype-from-frontmatter.js';

describe('archetypeFromFrontmatter', () => {
	it('should return failure if frontmatter is missing', async () => {
		const result = await archetypeFromFrontmatter({});

		if (result.ok) {
			throw new Error('Expected an error but got a successful result');
		} else {
			expect(result.error.message).toEqual('`frontmatter` is missing from the pipeline context');
		}
	});

	it('should convert frontmatter to archetype', async () => {
		const frontmatter = { key: 'value' };

		const result = await archetypeFromFrontmatter({ frontmatter });

		if (result.ok) {
			expect(result.value.archetype).toEqual(frontmatter);
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle empty frontmatter', async () => {
		const frontmatter = {};

		const result = await archetypeFromFrontmatter({ frontmatter });

		if (result.ok) {
			expect(result.value.archetype).toEqual(frontmatter);
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should preserve other context properties', async () => {
		const frontmatter = { key: 'value' };

		const result = await archetypeFromFrontmatter({
			frontmatter,
			otherProp: 'otherValue'
		} as PipelineContext);

		if (result.ok) {
			expect(result.value).toEqual({ archetype: frontmatter, otherProp: 'otherValue' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});
});
