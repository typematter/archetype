// build.js
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

execSync('tsc', { stdio: 'inherit' });

await esbuild.build({
	entryPoints: ['src/index.ts'],
	outdir: 'dist',
	bundle: true,
	platform: 'node',
	format: 'esm',
	target: 'esnext',
	sourcemap: true,
	banner: {
		js: '// Generated with esbuild'
	}
});
