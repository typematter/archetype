import { failure, success, type PipelineStage } from '@typematter/pipeline';

declare module '@typematter/pipeline' {
	interface PipelineContext {
		content?: string;
		markdown?: string;
		yaml?: string;
	}
}

const splitContent: PipelineStage = async ({ content, ...rest }) => {
	if (content === undefined || content === null) {
		return failure('`content` is missing from the pipeline context');
	}

	const [, yaml, ...markdown] = content.split(/^---[ \t]*$/m);

	return success({ ...rest, markdown: markdown.join('---').trim(), yaml: yaml?.trim() });
};

export default splitContent;
