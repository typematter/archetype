import { failure, success, type PipelineStage } from '@typematter/pipeline';

const splitContent: PipelineStage = async ({ content, ...rest }: { content?: string }) => {
	if (content === undefined || content === null) {
		return failure('`content` is missing from the pipeline context');
	}

	const [, yaml, ...markdown] = content.split(/^---[ \t]*$/m);

	return success({ ...rest, markdown: markdown.join('---').trim(), yaml: yaml?.trim() });
};

export default splitContent;
