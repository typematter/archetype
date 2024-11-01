import { failure, success, type PipelineStage } from '@typematter/pipeline';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

declare module '@typematter/pipeline' {
	interface PipelineContext {
		content?: string;
		name?: string;
	}
}

const createLocalLoader: (path: string) => PipelineStage =
	(path) =>
	async ({ name, ...rest }) => {
		if (name === undefined || name === null) {
			return failure('`name` is missing from the pipeline context');
		}

		const content = await readFile(join(path, `${name}.md`), 'utf-8');

		return success({ ...rest, content });
	};

export default createLocalLoader;
