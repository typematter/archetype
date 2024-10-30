import { defineConfig } from 'tsup';

export default defineConfig({
	banner: {
		js: '// Generated with esbuild'
	},
	bundle: true,
	clean: true,
	dts: true,
	entryPoints: ['src/index.ts'],
	external: ['esm-env', 'yaml'],
	format: 'esm',
	outdir: 'dist',
	platform: 'node',
	sourcemap: true,
	treeshake: true
});
