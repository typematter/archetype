import { failure, success } from '@typematter/pipeline';
import { describe, expect, it, vi } from 'vitest';
import createRemoteLoader from './create-remote-loader.js';

describe('createRemoteLoader', () => {
	const baseUrl = 'http://example.com/';
	const loader = createRemoteLoader(baseUrl);

	it('should return failure if name is missing', async () => {
		const result = await loader({});

		expect(result).toEqual(failure('`name` is missing from the pipeline context'));
	});

	it('should fetch content from the correct URL', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			text: () => Promise.resolve('mock content')
		});
		global.fetch = mockFetch;

		const result = await loader({ name: 'test' });

		expect(mockFetch).toHaveBeenCalledWith(new URL('test.md', baseUrl));
		expect(result).toEqual(success({ content: 'mock content' }));
	});

	it('should handle fetch errors gracefully', async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error('Fetch error'));
		global.fetch = mockFetch;

		await expect(loader({ name: 'test' })).rejects.toThrow('Fetch error');
	});
});
