import type { Archetype } from '$types/archetype.js';
import { failure, success, type PipelineStage } from '@typematter/pipeline';

declare module '@typematter/pipeline' {
	interface PipelineContext {
		frontmatter?: Record<string, unknown>;
		archetype?: Archetype;
	}
}

const archetypeFromFrontmatter: PipelineStage = async ({ frontmatter, ...rest }) => {
	if (frontmatter === undefined || frontmatter === null) {
		return failure('`frontmatter` is missing from the pipeline context');
	}

	const archetype = frontmatter as unknown as Archetype;

	return success({
		...rest,
		archetype
	});
};

export default archetypeFromFrontmatter;
