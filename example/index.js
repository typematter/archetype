import { createLocalStore, createValidator } from '@accuser/archetype';
import { join } from 'node:path';
import { cwd } from 'node:process';

const validator = await createValidator({
	store: createLocalStore(join(cwd(), 'data', 'archetypes'))
});
