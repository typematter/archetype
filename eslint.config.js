import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
	{ ignores: ['.pnpm-store', 'dist', 'node_modules'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	prettier
];
