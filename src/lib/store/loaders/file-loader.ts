import type { Loader } from '$types/loader.js';
import { readFile } from 'node:fs/promises';

const fileLoader: Loader = {
	canHandle: (path) => path.toString().match(/^file:\/\/|^\/|^\.\.?\//) !== null,
	load: async (path) => await readFile(`${path.toString()}.md`, 'utf-8')
};

export default fileLoader;
