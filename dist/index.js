import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { DEV } from 'esm-env';

// Generated with esbuild

// node_modules/.pnpm/@typematter+pipeline@https+++codeload.github.com+typematter+pipeline+tar.gz+acd739b0700ace64d07fc541c14be3973fa27bfc/node_modules/@typematter/pipeline/dist/index.js
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
var compose = (...stages) => async (context) => {
  let currentContext = context;
  for (const stage of stages) {
    try {
      const result = await stage(currentContext);
      if (result.ok) {
        currentContext = result.value;
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
var createLocalLoader = (path) => async ({ name, ...rest }) => {
  if (name === void 0 || name === null) {
    return failure("`name` is missing from the pipeline context");
  }
  const content = await readFile(join(path, `${name}.md`), "utf-8");
  return success_default({ ...rest, content });
};
var create_local_loader_default = createLocalLoader;

// src/lib/store/create-remote-loader.ts
var createRemoteLoader = (baseUrl) => async ({ name, ...rest }) => {
  if (name === void 0 || name === null) {
    return failure("`name` is missing from the pipeline context");
  }
  const url = new URL(`${name}.md`, baseUrl);
  const content = await fetch(url).then((res) => res.text());
  return success_default({ ...rest, content });
};
var create_remote_loader_default = createRemoteLoader;

// src/lib/pipelines/stages/archetype-from-frontmatter.ts
var archetypeFromFrontmatter = async ({ frontmatter, ...rest }) => {
  if (frontmatter === void 0 || frontmatter === null) {
    return failure("`frontmatter` is missing from the pipeline context");
  }
  const archetype = frontmatter;
  return success_default({
    ...rest,
    archetype
  });
};
var archetype_from_frontmatter_default = archetypeFromFrontmatter;
var frontmatterFromYaml = async ({ yaml, ...rest }) => {
  if (yaml === void 0 || yaml === null) {
    return failure("`yaml` is missing from the pipeline context");
  }
  const frontmatter = parse(yaml) ?? {};
  return success_default({
    ...rest,
    frontmatter
  });
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
var archetypeFromContent = compose_default(split_content_default, frontmatter_from_yaml_default, archetype_from_frontmatter_default);
var archetype_from_content_default = archetypeFromContent;

// src/types/archetype-store.ts
var ArchetypeLoadError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ArchetypeLoadError";
    this.cause = cause;
  }
};
var createStore = (loadContent, { cache = !DEV } = {}) => {
  const loadArchetype = compose_default(loadContent, archetype_from_content_default);
  const archetypeCache = cache ? /* @__PURE__ */ new Map() : void 0;
  return {
    load: async (name) => {
      if (archetypeCache?.has(name)) {
        return archetypeCache.get(name);
      }
      try {
        const { archetype } = await loadArchetype({ name }).then(resolve_default);
        if (archetype === void 0 || archetype === null) {
          throw "Failed to load archetype";
        }
        if (cache) {
          archetypeCache?.set(name, archetype);
        }
        return archetype;
      } catch (error) {
        throw new ArchetypeLoadError(
          name,
          error instanceof Error ? error : new Error(String(error))
        );
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
  store
}) => {
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

export { ArchetypeLoadError, create_local_loader_default as createLocalLoader, create_remote_loader_default as createRemoteLoader, createStore, create_validator_default as createValidator };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map