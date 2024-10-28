import type { PathLike } from 'node:fs';
import type { Archetype } from './archetype.js';
import type { ValidationResult } from './validation-result.js';
interface Options {
    /**
     * The root directory to load archetypes from.
     */
    root?: PathLike;
}
export declare const bootstrapArchetypeValidation: (options?: Options) => Promise<{
    archetypeSchema: Archetype;
    loadArchetype: (name: string) => Promise<Archetype>;
    validateArchetype: (archetype: unknown) => ValidationResult;
}>;
export default bootstrapArchetypeValidation;
//# sourceMappingURL=bootstrap-archetype-validation.d.ts.map