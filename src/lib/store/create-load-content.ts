import type { Loader } from '$types/loader.js';
import { failure, success, type PipelineStage } from '@typematter/pipeline';
import type { PathLike } from 'fs';
import fileLoader from './loaders/file-loader.js';
import httpLoader from './loaders/http-loader.js';
import nameLoader from './loaders/name-loader.js';
import pathLoader from './loaders/path-loader.js';

const defaultLoaders = [nameLoader, pathLoader, fileLoader, httpLoader];

const createLoadContent: (loaders?: Loader[]) => PipelineStage =
	(loaders = defaultLoaders) =>
	async ({ path, ...rest }: { path?: PathLike }) => {
		if (path === undefined || path === null) {
			return failure('`path` is missing from the pipeline context');
		}

		const loader = loaders.find((loader) => loader.canHandle(path));

		if (loader) {
			try {
				const content = await loader.load(path);

				return success({ ...rest, content });
			} catch (error) {
				return failure(error);
			}
		}

		return failure('No suitable strategy found');
	};

export default createLoadContent;
