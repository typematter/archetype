import { describe, expect, it } from 'vitest';
import splitContent from './split-content.js';

describe('splitContent', () => {
	it('should return failure if content is missing', async () => {
		const result = await splitContent({});

		if (result.ok) {
			throw new Error('Expected an error but got a successful result');
		} else {
			expect(result.error.message).toEqual('`content` is missing from the pipeline context');
		}
	});

	it('should split content into yaml and markdown', async () => {
		const content = '---\nyaml content\n---\nmarkdown content';

		const result = await splitContent({ content });

		if (result.ok) {
			expect(result.value).toEqual({ markdown: 'markdown content', yaml: 'yaml content' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle content without yaml section', async () => {
		const content = '---\n---\nmarkdown content';
		const result = await splitContent({ content });

		if (result.ok) {
			expect(result.value).toEqual({ markdown: 'markdown content', yaml: '' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle content without markdown section', async () => {
		const content = '---\nyaml content\n---\n';
		const result = await splitContent({ content });

		if (result.ok) {
			expect(result.value).toEqual({ markdown: '', yaml: 'yaml content' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle content with extra sections', async () => {
		const content = '---\nyaml content\n---\nmarkdown content\n---\nextra content';
		const result = await splitContent({ content });

		if (result.ok) {
			expect(result.value).toEqual({
				markdown: 'markdown content\n---\nextra content',
				yaml: 'yaml content'
			});
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});
});
