import { type PipelineContext } from '@typematter/pipeline';
import { describe, expect, it } from 'vitest';
import frontmatterFromYaml from './frontmatter-from-yaml.js';

describe('frontmatterFromYaml', () => {
	it('should return failure if yaml is missing', async () => {
		const result = await frontmatterFromYaml({});

		if (result.ok) {
			throw new Error('Expected an error but got a successful result');
		} else {
			expect(result.error.message).toEqual('`yaml` is missing from the pipeline context');
		}
	});

	it('should parse yaml into frontmatter', async () => {
		const yaml = 'key: value';
		const result = await frontmatterFromYaml({ yaml });

		if (result.ok) {
			expect(result.value.frontmatter).toEqual({ key: 'value' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle empty yaml', async () => {
		const yaml = '';
		const result = await frontmatterFromYaml({ yaml });

		if (result.ok) {
			expect(result.value.frontmatter).toEqual({});
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should handle complex yaml', async () => {
		const yaml = 'key1: value1\nkey2:\n  - item1\n  - item2';
		const result = await frontmatterFromYaml({ yaml });

		if (result.ok) {
			expect(result.value.frontmatter).toEqual({ key1: 'value1', key2: ['item1', 'item2'] });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});

	it('should preserve other context properties', async () => {
		const yaml = 'key: value';
		const result = await frontmatterFromYaml({ yaml, otherProp: 'otherValue' } as PipelineContext);

		if (result.ok) {
			expect(result.value).toEqual({ frontmatter: { key: 'value' }, otherProp: 'otherValue' });
		} else {
			throw new Error('Expected a successful result but got an error');
		}
	});
});
