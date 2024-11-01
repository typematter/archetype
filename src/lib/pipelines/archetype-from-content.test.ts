import { describe, expect, it } from 'vitest';
import archetypeFromContent from './archetype-from-content.js';

describe('archetypeFromContent', () => {
	it('should process content and return expected archetype', async () => {
		const content = `
---
title: Test Title
description: Test Description
---
This is the content body.
`;

		const result = await archetypeFromContent({ content });

		if (result.ok) {
			expect(result.value.archetype).toEqual({
				title: 'Test Title',
				description: 'Test Description'
			});
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle content without frontmatter', async () => {
		const content = 'This is the content body without frontmatter.';

		const result = await archetypeFromContent({ content });

		if (result.ok) {
			throw new Error('Expected an error but got a successful result');
		} else {
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toBe('`yaml` is missing from the pipeline context');
		}
	});

	it('should handle empty content', async () => {
		const content = '';

		const result = await archetypeFromContent({ content });

		if (result.ok) {
			throw new Error('Expected an error but got a successful result');
		} else {
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toBe('`yaml` is missing from the pipeline context');
		}
	});
});
