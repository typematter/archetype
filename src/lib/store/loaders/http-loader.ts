import type { Loader } from '$types/loader.js';

const httpLoader: Loader = {
	canHandle: (path) => path.toString().match(/^https?:\/\//) !== null,
	load: async (path) => await fetch(path.toString()).then((res) => res.text())
};

export default httpLoader;
