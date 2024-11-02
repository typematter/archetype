import type { Loader } from '$types/loader.js';
import { readFile } from 'node:fs/promises';

const pathLoader: Loader = {
	canHandle: (path) => {
		const filename = path.toString();

		return (
			(filename.startsWith('/') || filename.startsWith('./') || filename.startsWith('../')) &&
			filename.endsWith('.md')
		);
	},
	load: (path) => readFile(path.toString(), 'utf-8')
};

export default pathLoader;
