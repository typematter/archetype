import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';
import pathLoader from './path-loader.js';

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn()
}));

describe('pathLoader', () => {
	describe('canHandle', () => {
		it('should return true for absolute paths', () => {
			expect(pathLoader.canHandle('/path/to/file.md')).toBe(true);
		});

		it('should return true for relative paths starting with ./', () => {
			expect(pathLoader.canHandle('./file.md')).toBe(true);
		});

		it('should return true for relative paths starting with ../', () => {
			expect(pathLoader.canHandle('../file.md')).toBe(true);
		});

		it('should return false for paths not ending with .md', () => {
			expect(pathLoader.canHandle('/path/to/file.txt')).toBe(false);
		});

		it('should return false for paths not starting with /, ./, or ../', () => {
			expect(pathLoader.canHandle('file.md')).toBe(false);
		});
	});

	describe('load', () => {
		it('should read the file content as utf-8', async () => {
			const mockPath = '/path/to/file.md';
			const mockContent = 'file content';
			vi.mocked(readFile).mockResolvedValue(mockContent);

			const content = await pathLoader.load(mockPath);

			expect(readFile).toHaveBeenCalledWith(mockPath, 'utf-8');
			expect(content).toBe(mockContent);
		});
	});
});
