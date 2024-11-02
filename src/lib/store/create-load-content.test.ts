import { failure, success } from '@typematter/pipeline';
import { describe, expect, it, vi } from 'vitest';
import createLoadContent from './create-load-content.js';

describe('createLoader', () => {
	const mockFileLoader = {
		canHandle: vi.fn(),
		load: vi.fn()
	};

	const mockHttpLoader = {
		canHandle: vi.fn(),
		load: vi.fn()
	};

	const loaders = [mockFileLoader, mockHttpLoader];
	const loader = createLoadContent(loaders);

	it('should return failure if path is missing', async () => {
		const result = await loader({});

		expect(result).toEqual(failure('`path` is missing from the pipeline context'));
	});

	it('should use the first loader that can handle the path', async () => {
		mockFileLoader.canHandle.mockReturnValue(false);
		mockHttpLoader.canHandle.mockReturnValue(true);
		mockHttpLoader.load.mockResolvedValue('http content');

		const result = await loader({ path: 'http://example.com' });

		expect(mockFileLoader.canHandle).toHaveBeenCalledWith('http://example.com');
		expect(mockHttpLoader.canHandle).toHaveBeenCalledWith('http://example.com');
		expect(mockHttpLoader.load).toHaveBeenCalledWith('http://example.com');
		expect(result).toEqual(success({ content: 'http content' }));
	});

	it('should return failure if no loader can handle the path', async () => {
		mockFileLoader.canHandle.mockReturnValue(false);
		mockHttpLoader.canHandle.mockReturnValue(false);

		const result = await loader({ path: 'unknown://example.com' });

		expect(result).toEqual(failure('No suitable strategy found'));
	});

	it('should return failure if loader throws an error', async () => {
		mockFileLoader.canHandle.mockReturnValue(true);
		mockFileLoader.load.mockRejectedValue(new Error('Load error'));

		const result = await loader({ path: 'file:///example.txt' });

		expect(result).toEqual(failure(new Error('Load error')));
	});
});
