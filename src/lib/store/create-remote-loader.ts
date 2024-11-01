import { failure, success, type PipelineStage } from '@typematter/pipeline';

declare module '@typematter/pipeline' {
	interface PipelineContext {
		content?: string;
		name?: string;
	}
}

const createRemoteLoader: (baseUrl: string | URL) => PipelineStage =
	(baseUrl) =>
	async ({ name, ...rest }) => {
		if (name === undefined || name === null) {
			return failure('`name` is missing from the pipeline context');
		}

		const url = new URL(`${name}.md`, baseUrl);
		const content = await fetch(url).then((res) => res.text());

		return success({ ...rest, content });
	};

export default createRemoteLoader;
