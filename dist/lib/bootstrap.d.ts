import type { ArchetypeEngine } from '$types/archetype-engine.js';
import type { PathLike } from 'node:fs';
interface BootstrapOptions {
    /**
     * The root directory to load archetypes from.
     */
    root?: PathLike;
}
declare const bootstrap: (options?: BootstrapOptions) => Promise<ArchetypeEngine>;
export default bootstrap;
export type { BootstrapOptions };
//# sourceMappingURL=bootstrap.d.ts.map