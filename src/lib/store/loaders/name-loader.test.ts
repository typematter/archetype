import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { describe, expect, it, vi } from 'vitest';
import nameLoader from './name-loader.js';

vi.mock('node:fs/promises');
vi.mock('node:path');
vi.mock('node:process');

describe('nameLoader', () => {
	it('should handle valid archetype names', () => {
		expect(nameLoader.canHandle('valid-name')).toBe(true);
		expect(nameLoader.canHandle('anotherValidName')).toBe(true);
	});

	it('should not handle invalid archetype names', () => {
		expect(nameLoader.canHandle('invalid name')).toBe(false);
		expect(nameLoader.canHandle('invalid/name')).toBe(false);
		expect(nameLoader.canHandle('invalid.name')).toBe(false);
		expect(nameLoader.canHandle('')).toBe(false);
	});

	it('should load the correct file content', async () => {
		const mockPath = 'valid-name';
		const mockContent = 'file content';
		const mockFilename = `/mocked/path/data/archetypes/${mockPath}.md`;

		vi.mocked(join).mockReturnValue(mockFilename);
		vi.mocked(cwd).mockReturnValue('/mocked/path');
		vi.mocked(readFile).mockResolvedValue(mockContent);

		const result = await nameLoader.load(mockPath);

		expect(join).toHaveBeenCalledWith('/mocked/path', 'data', 'archetypes', `${mockPath}.md`);
		expect(readFile).toHaveBeenCalledWith(mockFilename, 'utf-8');
		expect(result).toBe(mockContent);
	});

	it('should throw an error if the file cannot be read', async () => {
		const mockPath = 'valid-name';
		const mockError = new Error('File not found');

		vi.mocked(readFile).mockRejectedValue(mockError);

		await expect(nameLoader.load(mockPath)).rejects.toThrow('File not found');
	});
});
