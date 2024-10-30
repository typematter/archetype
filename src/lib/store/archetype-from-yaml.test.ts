import type { Archetype } from '$types/archetype.js';
import { describe, expect, it } from 'vitest';
import archetypeFromYaml from './archetype-from-yaml.js';

describe('archetypeFromYaml', () => {
	it('should parse a valid YAML string into an Archetype object', () => {
		const yaml = `
name: person
version: 1.0.0
schema:
  required:
    name: { type: 'String' }
    age: { type: 'Number' }
  optional:
    email: { type: 'String' }
`;
		const expected: Archetype = {
			name: 'person',
			version: '1.0.0',
			schema: {
				required: {
					name: { type: 'String' },
					age: { type: 'Number' }
				},
				optional: {
					email: { type: 'String' }
				}
			}
		};

		const result = archetypeFromYaml(yaml);

		expect(result).toEqual(expected);
	});

	it('should throw an error for invalid YAML string', () => {
		const invalidYaml = `
name: person
version: 1.0.0
schema:
  required:
    name: { type: 'String'
    age: { type: 'Number' }
  optional:
    email: { type: 'String' }
`;

		expect(() => archetypeFromYaml(invalidYaml)).toThrow();
	});
});
