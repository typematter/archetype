import { compose } from '@typematter/pipeline';
import archetypeFromFrontmatter from './stages/archetype-from-frontmatter.js';
import frontmatterFromYaml from './stages/frontmatter-from-yaml.js';
import splitContent from './stages/split-content.js';

const archetypeFromContent = compose(splitContent, frontmatterFromYaml, archetypeFromFrontmatter);

export default archetypeFromContent;
