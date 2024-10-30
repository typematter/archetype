import type { Archetype } from '$types/archetype.js';

const extendArchetype: (archetype: Archetype, extensions: Archetype[]) => Archetype = (
	archetype,
	extensions
) =>
	extensions.reduce(
		(prev, { schema: { required, optional } }) => ({
			...prev,
			schema: {
				required: { ...prev.schema.required, ...required },
				optional: { ...prev.schema.optional, ...optional }
			}
		}),
		archetype
	);

export default extendArchetype;
