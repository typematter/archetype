import { describe, expect, it } from 'vitest';
import yamlFromMarkdown from './yaml-from-markdown.js';

describe('yamlFromMarkdown', () => {
	it('should extract YAML content from a valid markdown string', () => {
		const markdown = `
---
name: person
version: 1.0.0
schema:
  required:
	name: { type: 'String' }
	age: { type: 'Number' }
  optional:
	email: { type: 'String' }
---
# Some Markdown Content
`;

		const expectedYaml = `
name: person
version: 1.0.0
schema:
  required:
	name: { type: 'String' }
	age: { type: 'Number' }
  optional:
	email: { type: 'String' }
`;

		const result = yamlFromMarkdown(markdown);

		expect(result.trim()).toEqual(expectedYaml.trim());
	});

	it('should throw an error if YAML content is missing', () => {
		const invalidMarkdown = `
# Some Markdown Content
`;

		expect(() => yamlFromMarkdown(invalidMarkdown)).toThrow('YAML content is missing in the file');
	});
});
