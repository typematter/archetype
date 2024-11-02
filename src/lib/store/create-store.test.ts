import archetypeFromContent from '$lib/pipelines/archetype-from-content.js';
import { ArchetypeLoadError } from '$types/archetype-store.js';
import type { Archetype } from '$types/archetype.js';
import type { Loader } from '$types/loader.js';
import { describe, expect, it, vi } from 'vitest';
import createStore from './create-store.js';

vi.mock('$lib/pipelines/archetype-from-content.js', () => ({
	default: vi.fn()
}));

const mockArchetype: Archetype = {
	name: 'test',
	version: '1.0.0',
	schema: {
		required: {
			name: { type: 'String' },
			version: { type: 'String' }
		},
		optional: {}
	}
};

const mockLoader: Loader = {
	canHandle: (path) => path.toString() === 'valid-path',
	load: vi.fn().mockResolvedValue('mock content')
};

describe('createStore', () => {
	it('should return an object with a load function', () => {
		const store = createStore();

		expect(store.load).toBeDefined();
		expect(typeof store.load).toBe('function');
	});

	describe('load', () => {
		it('should load a valid archetype', async () => {
			const store = createStore({ loaders: [mockLoader] });
			vi.mocked(archetypeFromContent).mockResolvedValue({
				ok: true,
				value: { archetype: mockArchetype }
			});

			const archetype = await store.load('valid-path');

			expect(archetype).toEqual(mockArchetype);
		});

		it('should throw an error for an invalid path', async () => {
			const store = createStore({ loaders: [mockLoader] });
			await expect(store.load('invalid-path')).rejects.toThrow(ArchetypeLoadError);
		});

		it('should cache the archetype if caching is enabled', async () => {
			const store = createStore({ cache: true, loaders: [mockLoader] });
			vi.mocked(archetypeFromContent).mockResolvedValue({
				ok: true,
				value: { archetype: mockArchetype }
			});
			const archetype = await store.load('valid-path');
			expect(archetype).toEqual(mockArchetype);

			const cachedArchetype = await store.load('valid-path');
			expect(cachedArchetype).toEqual(mockArchetype);
			expect(mockLoader.load).toHaveBeenCalledTimes(1);
		});

		it('should not cache the archetype if caching is disabled', async () => {
			const store = createStore({ cache: false, loaders: [mockLoader] });
			vi.mocked(archetypeFromContent).mockResolvedValue({
				ok: true,
				value: { archetype: mockArchetype }
			});
			const archetype = await store.load('valid-path');

			expect(archetype).toEqual(mockArchetype);

			await store.load('valid-path');

			expect(mockLoader.load).toHaveBeenCalledTimes(2);
		});
	});
});
