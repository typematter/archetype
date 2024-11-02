import { createValidator } from '@typematter/archetype';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { parse } from 'yaml';

const validator = await createValidator();

const postArchetype = await validator.loadArchetype('post');

console.log('Post archetype:');
console.dir(postArchetype, { depth: null });
console.log();

const post = await readFile(join(cwd(), 'data', 'posts', 'first-post.md'), 'utf8');
const frontmatter = parse(post.split('---\n')[1]);

console.log('Frontmatter:');
console.dir(frontmatter, { depth: null });
console.log();

const { errors, valid } = await validator.validateFrontmatter(frontmatter);

if (!valid) {
	console.error('Frontmatter is invalid!');
	console.error(errors);
} else {
	console.log('Frontmatter is valid!');
}
