import * as esbuild from 'esbuild';
import { execSync } from 'node:child_process';

execSync('tsc --emitDeclarationOnly', { stdio: 'inherit' });

await esbuild.build({
	banner: {
		js: '// Generated with esbuild'
	},
	bundle: true,
	entryPoints: ['src/index.ts'],
	external: ['yaml'],
	format: 'esm',
	outdir: 'dist',
	platform: 'node',
	sourcemap: true,
	target: 'esnext'
});
