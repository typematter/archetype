import { failure, success, type PipelineStage } from '@typematter/pipeline';
import { parse } from 'yaml';

const frontmatterFromYaml: PipelineStage = async ({ yaml, ...rest }: { yaml?: string }) => {
	if (yaml === undefined || yaml === null) {
		return failure('`yaml` is missing from the pipeline context');
	}

	const frontmatter: Record<string, unknown> = parse(yaml) ?? undefined;

	return success({ ...rest, frontmatter });
};

export default frontmatterFromYaml;
