import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';
import fileLoader from './file-loader.js';

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn()
}));

describe('fileLoader', () => {
	describe('canHandle', () => {
		it('should return true for file URLs', () => {
			expect(fileLoader.canHandle('file:///path/to/file')).toBe(true);
		});

		it('should return true for absolute paths', () => {
			expect(fileLoader.canHandle('/path/to/file')).toBe(true);
		});

		it('should return true for relative paths', () => {
			expect(fileLoader.canHandle('./path/to/file')).toBe(true);
			expect(fileLoader.canHandle('../path/to/file')).toBe(true);
		});

		it('should return false for non-file paths', () => {
			expect(fileLoader.canHandle('http://example.com')).toBe(false);
			expect(fileLoader.canHandle('https://example.com')).toBe(false);
		});
	});

	describe('load', () => {
		it('should read the file and return its content', async () => {
			const mockContent = 'file content';
			vi.mocked(readFile).mockResolvedValue(mockContent);

			const content = await fileLoader.load('/path/to/file');

			expect(readFile).toHaveBeenCalledWith('/path/to/file.md', 'utf-8');
			expect(content).toBe(mockContent);
		});

		it('should throw an error if the file cannot be read', async () => {
			vi.mocked(readFile).mockRejectedValue(new Error('File not found'));

			await expect(fileLoader.load('/path/to/nonexistent')).rejects.toThrow('File not found');
		});
	});
});
