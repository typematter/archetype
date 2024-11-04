import type { Archetype } from '$types/archetype.js';
import { failure, success, type PipelineStage } from '@typematter/pipeline';

const archetypeFromFrontmatter: PipelineStage = async ({
	frontmatter,
	...rest
}: {
	frontmatter?: Record<string, unknown>;
}) => {
	if (frontmatter === undefined || frontmatter === null) {
		return failure('`frontmatter` is missing from the pipeline context');
	}

	const archetype = frontmatter as unknown as Archetype;

	return success({ ...rest, archetype });
};

export default archetypeFromFrontmatter;
