import { parse } from 'yaml';
import { DEV } from 'esm-env';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';

// Generated with esbuild

// node_modules/.pnpm/@typematter+pipeline@https+++codeload.github.com+typematter+pipeline+tar.gz+90e0e21c93f803654f7a5bec6aad97ba14475ddb/node_modules/@typematter/pipeline/dist/index.js
var PipelineError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "PipelineError";
  }
};
var failure = (error) => ({
  ok: false,
  error: error instanceof PipelineError ? error : new PipelineError(error instanceof Error ? error.message : String(error))
});
var success = (value) => ({
  ok: true,
  value
});
var success_default = success;
var compose = (stages, { mutate } = {}) => async (context) => {
  let currentContext = mutate === true ? context : structuredClone(context);
  for (const stage of stages) {
    try {
      const result = await stage(currentContext);
      if (result.ok) {
        currentContext = mutate === true ? Object.assign(currentContext, result.value) : result.value;
      } else {
        return result;
      }
    } catch (error) {
      return failure(error);
    }
  }
  return success_default(currentContext);
};
var compose_default = compose;
var resolve = (result) => {
  if (result.ok) {
    return result.value;
  } else {
    throw result.error;
  }
};
var resolve_default = resolve;

// src/lib/pipelines/stages/archetype-from-frontmatter.ts
var archetypeFromFrontmatter = async ({
  frontmatter,
  ...rest
}) => {
  if (frontmatter === void 0 || frontmatter === null) {
    return failure("`frontmatter` is missing from the pipeline context");
  }
  const archetype = frontmatter;
  return success_default({ ...rest, archetype });
};
var archetype_from_frontmatter_default = archetypeFromFrontmatter;
var frontmatterFromYaml = async ({ yaml, ...rest }) => {
  if (yaml === void 0 || yaml === null) {
    return failure("`yaml` is missing from the pipeline context");
  }
  const frontmatter = parse(yaml) ?? void 0;
  return success_default({ ...rest, frontmatter });
};
var frontmatter_from_yaml_default = frontmatterFromYaml;

// src/lib/pipelines/stages/split-content.ts
var splitContent = async ({ content, ...rest }) => {
  if (content === void 0 || content === null) {
    return failure("`content` is missing from the pipeline context");
  }
  const [, yaml, ...markdown] = content.split(/^---[ \t]*$/m);
  return success_default({ ...rest, markdown: markdown.join("---").trim(), yaml: yaml?.trim() });
};
var split_content_default = splitContent;

// src/lib/pipelines/archetype-from-content.ts
var archetypeFromContent = compose_default([split_content_default, frontmatter_from_yaml_default, archetype_from_frontmatter_default]);
var archetype_from_content_default = archetypeFromContent;

// src/types/archetype-store.ts
var ArchetypeLoadError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ArchetypeLoadError";
    this.cause = cause;
  }
};
var fileLoader = {
  canHandle: (path) => path.toString().match(/^file:\/\/|^\/|^\.\.?\//) !== null,
  load: async (path) => await readFile(`${path.toString()}.md`, "utf-8")
};
var file_loader_default = fileLoader;

// src/lib/store/loaders/http-loader.ts
var httpLoader = {
  canHandle: (path) => path.toString().match(/^https?:\/\//) !== null,
  load: async (path) => await fetch(path.toString()).then((res) => res.text())
};
var http_loader_default = httpLoader;
var nameLoader = {
  canHandle: (path) => path.toString().match(/^[\w][\w-]*$/) !== null,
  load: (path) => {
    const filename = join(cwd(), "data", "archetypes", `${path.toString()}.md`);
    return readFile(filename, "utf-8");
  }
};
var name_loader_default = nameLoader;
var pathLoader = {
  canHandle: (path) => {
    const filename = path.toString();
    return (filename.startsWith("/") || filename.startsWith("./") || filename.startsWith("../")) && filename.endsWith(".md");
  },
  load: (path) => readFile(path.toString(), "utf-8")
};
var path_loader_default = pathLoader;

// src/lib/store/create-load-content.ts
var defaultLoaders = [name_loader_default, path_loader_default, file_loader_default, http_loader_default];
var createLoadContent = (loaders = defaultLoaders) => async ({ path, ...rest }) => {
  if (path === void 0 || path === null) {
    return failure("`path` is missing from the pipeline context");
  }
  const loader = loaders.find((loader2) => loader2.canHandle(path));
  if (loader) {
    try {
      const content = await loader.load(path);
      return success_default({ ...rest, content });
    } catch (error) {
      return failure(error);
    }
  }
  return failure("No suitable strategy found");
};
var create_load_content_default = createLoadContent;

// src/lib/store/create-store.ts
var createStore = ({
  cache = !DEV,
  loaders
} = {}) => {
  const loadArchetype = compose_default([
    create_load_content_default(loaders),
    archetype_from_content_default
  ]);
  const archetypeCache = cache ? /* @__PURE__ */ new Map() : void 0;
  return {
    load: async (path) => {
      const name = path.toString();
      if (archetypeCache?.has(name)) {
        return archetypeCache.get(name);
      }
      try {
        const { archetype } = await loadArchetype({ path }).then(resolve_default);
        if (archetype === void 0 || archetype === null) {
          throw "Failed to load archetype";
        }
        if (cache) {
          archetypeCache?.set(name, archetype);
        }
        return archetype;
      } catch (error) {
        throw typeof error === "string" ? new ArchetypeLoadError(error) : new ArchetypeLoadError(`Error loading ${name}`, error);
      }
    }
  };
};

// src/lib/validation/validate-array-field.ts
var validateArrayField = (value, field, path = []) => {
  const errors = [];
  if (!Array.isArray(value)) {
    return [
      {
        path,
        message: `Expected array, got ${typeof value}`
      }
    ];
  }
  if (field.minItems !== void 0 && value.length < field.minItems) {
    errors.push({
      path,
      message: `Array must contain at least ${field.minItems} items`
    });
  }
  if (field.maxItems !== void 0 && value.length > field.maxItems) {
    errors.push({
      path,
      message: `Array must contain at most ${field.maxItems} items`
    });
  }
  value.forEach((item, index) => {
    errors.push(...validate_schema_field_default(item, field.items, [...path, index.toString()]));
  });
  return errors;
};
var validate_array_field_default = validateArrayField;

// src/lib/validation/validate-boolean-field.ts
var validateBooleanField = (value, field, path = []) => {
  const errors = [];
  if (typeof value !== "boolean") {
    return [
      {
        path,
        message: `Expected boolean, got ${typeof value}`
      }
    ];
  }
  return errors;
};
var validate_boolean_field_default = validateBooleanField;

// src/lib/validation/date-format/iso8601.ts
var ISO8601_FORMATS = {
  CALENDAR: /^(\d{4})-([01]\d)-([0-3]\d)(?:T([012]\d):([0-5]\d):([0-5]\d)(?:\.(\d+))?(Z|([+-])([01]\d):([0-5]\d))?)?$/,
  ORDINAL: /^(\d{4})-(\d{3})$/,
  WEEK: /^(\d{4})-W([0-5]\d)(?:-([1-7]))?$/
};
var parseWeekDate = (year, week, day = 1) => {
  const jan4th = new Date(year, 0, 4);
  const startOfWeek1 = new Date(jan4th);
  startOfWeek1.setDate(jan4th.getDate() - jan4th.getDay() + 1);
  const targetDate = new Date(startOfWeek1);
  targetDate.setDate(startOfWeek1.getDate() + (week - 1) * 7 + (day - 1));
  if (targetDate.getFullYear() !== year) {
    throw new Error("Invalid week date");
  }
  return targetDate;
};
var parseOrdinalDate = (year, ordinalDay) => {
  const date = new Date(year, 0, 1);
  date.setDate(ordinalDay);
  if (date.getFullYear() !== year) {
    throw new Error("Invalid ordinal date");
  }
  return date;
};
var parseDate = (dateString) => {
  const dateMatch = dateString.match(ISO8601_FORMATS.CALENDAR);
  if (dateMatch) {
    const [, y, m, d, h, min, s, ms, tz, o, hoff, minoff] = dateMatch;
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    const hour = h ? Number(h) : 0;
    const minute = min ? Number(min) : 0;
    const second = s ? Number(s) : 0;
    const millisecond = ms ? Number(ms) : 0;
    const hourOffset = hoff ? Number(`${o}${hoff}`) : 0;
    const minuteOffset = minoff ? Number(`${o}${minoff}`) : 0;
    const date = new Date(dateString);
    if (date instanceof Date === false) {
      throw new Error("Invalid calendar date");
    } else if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day || date.getHours() !== hour - hourOffset || date.getMinutes() !== minute - minuteOffset || date.getSeconds() !== second || date.getMilliseconds() !== millisecond) {
      throw new Error("Invalid calendar date");
    } else {
      return date;
    }
  }
  const weekMatch = dateString.match(ISO8601_FORMATS.WEEK);
  if (weekMatch) {
    const [, y, w, d] = weekMatch;
    const year = Number(y);
    const week = Number(w);
    const day = d ? Number(d) : 1;
    if (week < 1 || week > 53) {
      throw new Error("Invalid week number");
    }
    if (week === 53) {
      const dec31 = new Date(year, 11, 31);
      const lastWeek = Math.floor((dec31.getTime() - new Date(year, 0, 1).getTime()) / (864e5 * 7)) + 1;
      if (lastWeek !== 53) {
        throw new Error("Invalid week number");
      }
    }
    return parseWeekDate(year, week, day);
  }
  const ordinalMatch = dateString.match(ISO8601_FORMATS.ORDINAL);
  if (ordinalMatch) {
    const [, y, od] = ordinalMatch;
    const year = Number(y);
    const ordinalDay = Number(od);
    const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    const maxDays = isLeapYear ? 366 : 365;
    if (ordinalDay < 1 || ordinalDay > maxDays) {
      throw new Error("Invalid ordinal day number");
    }
    return parseOrdinalDate(year, ordinalDay);
  }
  throw new Error("Invalid ISO-8601 date format");
};
var isValidDate = (date) => {
  try {
    return parseDate(date) instanceof Date;
  } catch {
    return false;
  }
};

// src/lib/validation/validate-date-field.ts
var validateDateField = (value, field, path = []) => {
  const errors = [];
  if (typeof value !== "string" || isNaN(Date.parse(value))) {
    return [
      {
        path,
        message: "Invalid date format"
      }
    ];
  }
  if (field.format === "ISO-8601" && isValidDate(value) === false) {
    errors.push({
      path,
      message: "Date must be in ISO-8601 format"
    });
  }
  return errors;
};
var validate_date_field_default = validateDateField;

// src/lib/validation/validate-number-field.ts
var validateNumberField = (value, field, path = []) => {
  const errors = [];
  if (typeof value !== "number") {
    return [
      {
        path,
        message: `Expected number, got ${typeof value}`
      }
    ];
  }
  if (field.min !== void 0 && value < field.min) {
    errors.push({
      path,
      message: `Value must be >= ${field.min}`
    });
  }
  if (field.max !== void 0 && value > field.max) {
    errors.push({
      path,
      message: `Value must be <= ${field.max}`
    });
  }
  return errors;
};
var validate_number_field_default = validateNumberField;

// src/lib/validation/validate-object-field.ts
var validateObjectField = (value, field, path = []) => {
  const errors = [];
  if (typeof value !== "object" || value === null) {
    return [
      {
        path,
        message: `Expected object, got ${typeof value}`
      }
    ];
  }
  const valueObj = value;
  field.required?.forEach((requiredProp) => {
    if (!(requiredProp in valueObj)) {
      errors.push({
        path: [...path, requiredProp],
        message: "Required property missing"
      });
    }
  });
  if (field.properties) {
    Object.entries(field.properties).forEach(([key, propSchema]) => {
      if (key in valueObj) {
        errors.push(...validate_schema_field_default(valueObj[key], propSchema, [...path, key]));
      }
    });
  }
  return errors;
};
var validate_object_field_default = validateObjectField;

// src/lib/validation/validate-string-field.ts
var validateStringField = (value, field, path = []) => {
  const errors = [];
  if (typeof value !== "string") {
    return [
      {
        path,
        message: `Expected string, got ${typeof value}`
      }
    ];
  }
  if (field.enum && !field.enum.includes(value)) {
    errors.push({
      path,
      message: `Value must be one of: ${field.enum.join(", ")}`
    });
  }
  if (field.pattern && !new RegExp(field.pattern).test(value)) {
    errors.push({
      path,
      message: `Value does not match pattern: ${field.pattern}`
    });
  }
  return errors;
};
var validate_string_field_default = validateStringField;

// src/lib/validation/validators.ts
var validators = {
  Array: validate_array_field_default,
  Boolean: validate_boolean_field_default,
  Date: validate_date_field_default,
  Number: validate_number_field_default,
  Object: validate_object_field_default,
  String: validate_string_field_default
};
var validators_default = validators;

// src/lib/validation/validate-schema-field.ts
var validateSchemaField = (value, field, path = []) => {
  const validator = validators_default[field.type];
  if (validator) {
    return validator(value, field, path);
  }
  throw new Error(`No validator found for type: ${field.type}`);
};
var validate_schema_field_default = validateSchemaField;

// src/lib/validation/validate-archetype.ts
var validateArchetype = (archetype, archetypeSchema) => {
  const errors = [];
  for (const [fieldName, fieldSchema] of Object.entries(archetypeSchema.schema.required)) {
    const value = archetype && typeof archetype === "object" ? archetype[fieldName] : void 0;
    if (value === void 0) {
      errors.push({
        path: [fieldName],
        message: "Required field missing"
      });
    } else {
      errors.push(...validate_schema_field_default(value, fieldSchema, [fieldName]));
    }
  }
  for (const [fieldName, fieldSchema] of Object.entries(archetypeSchema.schema.optional)) {
    const value = archetype && typeof archetype === "object" ? archetype[fieldName] : void 0;
    if (value !== void 0) {
      errors.push(...validate_schema_field_default(value, fieldSchema, [fieldName]));
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
};
var validate_archetype_default = validateArchetype;

// src/lib/validation/validation-error.ts
var validationError = (message, path = []) => ({
  message,
  path
});
var validation_error_default = validationError;

// src/lib/validation/validate-frontmatter.ts
var validateFrontmatter = async (frontmatter, { loadArchetype }) => {
  if (frontmatter === null || typeof frontmatter !== "object") {
    return {
      valid: false,
      errors: [validation_error_default("Frontmatter must be an object")]
    };
  }
  const archetypeName = "type" in frontmatter && typeof frontmatter.type === "string" ? frontmatter.type : void 0;
  if (archetypeName === void 0) {
    return {
      valid: false,
      errors: [validation_error_default("Frontmatter must have a `type` field", ["type"])]
    };
  }
  const archetype = await loadArchetype(archetypeName);
  return validate_archetype_default(frontmatter, archetype);
};
var validate_frontmatter_default = validateFrontmatter;

// src/lib/validator/extend-archetype.ts
var extendArchetype = (archetype, extensions) => extensions.reduce(
  (prev, { schema: { required, optional } }) => ({
    ...prev,
    schema: {
      required: { ...prev.schema.required, ...required },
      optional: { ...prev.schema.optional, ...optional }
    }
  }),
  archetype
);
var extend_archetype_default = extendArchetype;

// src/lib/validator/create-validator.ts
var createValidator = async ({
  store: _store = createStore(),
  validation: { strictMode = false, allowUnknownFields = false } = {}
} = {}) => {
  const store = typeof _store === "object" ? "load" in _store ? _store : createStore(_store) : void 0;
  if (store === void 0) {
    throw new Error("Invalid store configuration");
  }
  const archetypeSchema = await store.load("archetype");
  const { errors, valid } = validate_archetype_default(archetypeSchema, archetypeSchema);
  if (!valid) {
    throw new Error("Invalid archetype schema", { cause: errors });
  }
  const validator = {
    archetypeSchema,
    loadArchetype: async (name) => {
      const archetype = await store.load(name);
      const loadedArchetypes = /* @__PURE__ */ new Map();
      const loadArchetypeRecursive = async (names = []) => {
        for (const name2 of names) {
          if (loadedArchetypes.has(name2)) {
            continue;
          }
          const archetype2 = await store.load(name2);
          loadedArchetypes.set(name2, archetype2);
          if (archetype2.extends) {
            await loadArchetypeRecursive(archetype2.extends);
          }
        }
      };
      await loadArchetypeRecursive(archetype.extends);
      return extend_archetype_default(archetype, Array.from(loadedArchetypes.values()));
    },
    validateArchetype: async (archetype) => validate_archetype_default(archetype, archetypeSchema),
    validateFrontmatter: async (frontmatter) => validate_frontmatter_default(frontmatter, validator)
  };
  return validator;
};
var create_validator_default = createValidator;

export { ArchetypeLoadError, create_validator_default as createValidator };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map