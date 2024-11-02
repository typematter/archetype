import type { PathLike } from 'node:fs';

interface Loader {
	canHandle(path: PathLike): boolean;
	load(path: PathLike): Promise<string>;
}

export type { Loader };
