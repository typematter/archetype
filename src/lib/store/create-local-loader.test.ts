import { failure, success } from '@typematter/pipeline';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import createLocalLoader from './create-local-loader.js';

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn()
}));

describe('createLocalLoader', () => {
	const path = '/mock/path';
	const loader = createLocalLoader(path);

	it('should return failure if name is missing', async () => {
		const result = await loader({});

		expect(result).toEqual(failure('`name` is missing from the pipeline context'));
	});

	it('should return success with content if name is provided', async () => {
		const name = 'test-file';
		const content = 'file content';
		vi.mocked(readFile).mockResolvedValue(content);

		const result = await loader({ name });

		expect(readFile).toHaveBeenCalledWith(join(path, `${name}.md`), 'utf-8');
		expect(result).toEqual(success({ content }));
	});
});
