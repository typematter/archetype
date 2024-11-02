import { describe, expect, it, vi } from 'vitest';
import httpLoader from './http-loader.js';

global.fetch = vi.fn();

describe('httpLoader', () => {
	describe('canHandle', () => {
		it('should return true for HTTP URLs', () => {
			expect(httpLoader.canHandle('http://example.com')).toBe(true);
		});

		it('should return true for HTTPS URLs', () => {
			expect(httpLoader.canHandle('https://example.com')).toBe(true);
		});

		it('should return false for non-HTTP URLs', () => {
			expect(httpLoader.canHandle('file:///path/to/file')).toBe(false);
			expect(httpLoader.canHandle('/path/to/file')).toBe(false);
			expect(httpLoader.canHandle('./path/to/file')).toBe(false);
			expect(httpLoader.canHandle('../path/to/file')).toBe(false);
		});
	});

	describe('load', () => {
		it('should fetch the URL and return its content', async () => {
			const mockContent = 'response content';
			vi.mocked(fetch).mockResolvedValue({
				text: vi.fn().mockResolvedValue(mockContent)
			} as unknown as Response);

			const content = await httpLoader.load('http://example.com');

			expect(fetch).toHaveBeenCalledWith('http://example.com');
			expect(content).toBe(mockContent);
		});

		it('should throw an error if the fetch fails', async () => {
			vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

			await expect(httpLoader.load('http://example.com')).rejects.toThrow('Network error');
		});
	});
});
