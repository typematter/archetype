import * as esbuild from 'esbuild';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

execSync('tsc --emitDeclarationOnly', { stdio: 'inherit' });

await esbuild.build({
	alias: {
		$lib: resolve(import.meta.dirname, './src/lib'),
		$types: resolve(import.meta.dirname, './src/types')
	},
	banner: {
		js: '// Generated with esbuild'
	},
	bundle: true,
	entryPoints: ['src/index.ts'],
	format: 'esm',
	outdir: 'dist',
	platform: 'node',
	sourcemap: true,
	target: 'esnext'
});
