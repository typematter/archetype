import { bootstrap } from '@accuser/archetype';

const engine = await bootstrap();
const post = await engine.loadArchetype('post');

console.dir(post, { depth: null });

const { errors, valid } = engine.validateArchetype(post);

console.log(errors, valid);
