import { failure, success, type PipelineStage } from '@typematter/pipeline';
import { parse } from 'yaml';

declare module '@typematter/pipeline' {
	interface PipelineContext {
		frontmatter?: Record<string, unknown>;
		yaml?: string;
	}
}

const frontmatterFromYaml: PipelineStage = async ({ yaml, ...rest }) => {
	if (yaml === undefined || yaml === null) {
		return failure('`yaml` is missing from the pipeline context');
	}

	const frontmatter: Record<string, unknown> = parse(yaml) ?? {};

	return success({
		...rest,
		frontmatter
	});
};

export default frontmatterFromYaml;
