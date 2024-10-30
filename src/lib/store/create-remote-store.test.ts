import { beforeEach, describe, expect, it, vi } from 'vitest';
import archetypeFromYaml from './archetype-from-yaml.js';
import createRemoteStore from './create-remote-store.js';
import yamlFromMarkdown from './yaml-from-markdown.js';

global.fetch = vi.fn();

vi.mock('./archetype-from-yaml', () => ({
	default: vi.fn()
}));

vi.mock('./yaml-from-markdown', () => ({
	default: vi.fn()
}));

describe('createLocalStore', () => {
	const root = 'https://path.to/archetypes';
	const store = createRemoteStore(root);

	it('should create a store with a load function', () => {
		expect(store.load).toBeDefined();
		expect(typeof store.load).toBe('function');
	});

	describe('load', () => {
		const name = 'archetype';
		const mockMarkdown = 'mock markdown content';
		const mockYaml = 'mock yaml content';
		const mockArchetype = {
			name: 'archetype',
			version: '1.0.0',
			schema: {
				required: {
					name: {
						type: 'String' as const
					},
					version: {
						type: 'String' as const
					},
					schema: {
						type: 'Object' as const,
						properties: {
							required: { type: 'Object' as const },
							optional: { type: 'Object' as const }
						}
					}
				},
				optional: {
					extends: {
						type: 'Array' as const,
						items: {
							type: 'String' as const
						}
					}
				}
			}
		};

		beforeEach(() => {
			vi.mocked(global.fetch).mockResolvedValue(new Response(mockMarkdown, { status: 200 }));
			vi.mocked(yamlFromMarkdown).mockResolvedValue(mockYaml);
			vi.mocked(archetypeFromYaml).mockResolvedValue(mockArchetype);
		});

		it('should load an archetype from a remote markdown file', async () => {
			const result = await store.load(name);

			expect(yamlFromMarkdown).toHaveBeenCalledWith(mockMarkdown);
			expect(archetypeFromYaml).toHaveBeenCalledWith(mockYaml);
			expect(result).toBe(mockArchetype);
		});
	});
});
