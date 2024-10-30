import type { Archetype } from '$types/archetype.js';
import { parse } from 'yaml';

const archetypeFromYaml = (yaml: string): Archetype => parse(yaml);

export default archetypeFromYaml;
