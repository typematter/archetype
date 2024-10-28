import { join } from 'node:path';
import { cwd } from 'node:process';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

// Generated with esbuild

var loadArchetype = async (name, path) => {
  const filename = join(path, `${name}.md`);
  const text = await readFile(filename, "utf-8");
  const [, yaml] = text.split("---\n");
  if (yaml) {
    return parse(yaml);
  }
  throw new Error("YAML content is missing in the file");
};
var load_archetype_default = loadArchetype;

// src/lib/guards/is-unknown-field.ts
var isUnknownField = (field) => field !== void 0 && field !== null && typeof field === "object" && "type" in field && typeof field.type === "string";
var is_unknown_field_default = isUnknownField;

// src/lib/guards/is-array-field.ts
var isArrayField = (field) => is_unknown_field_default(field) && field.type === "Array";
var is_array_field_default = isArrayField;

// src/lib/guards/is-boolean-field.ts
var isBooleanField = (field) => is_unknown_field_default(field) && field.type === "Boolean";
var is_boolean_field_default = isBooleanField;

// src/lib/guards/is-date-field.ts
var isDateField = (field) => is_unknown_field_default(field) && field.type === "Date";
var is_date_field_default = isDateField;

// src/lib/guards/is-number-field.ts
var isNumberField = (field) => is_unknown_field_default(field) && field.type === "Number";
var is_number_field_default = isNumberField;

// src/lib/guards/is-object-field.ts
var isObjectField = (field) => is_unknown_field_default(field) && field.type === "Object";
var is_object_field_default = isObjectField;

// src/lib/guards/is-string-field.ts
var isStringField = (field) => is_unknown_field_default(field) && field.type === "String";
var is_string_field_default = isStringField;

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
  if (field.format === "ISO-8601" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
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

// src/lib/validation/validate-schema-field.ts
var validateSchemaField = (value, field, path = []) => {
  if (is_string_field_default(field)) {
    return validate_string_field_default(value, field, path);
  } else if (is_number_field_default(field)) {
    return validate_number_field_default(value, field, path);
  } else if (is_boolean_field_default(field)) {
    return validate_boolean_field_default(value, field, path);
  } else if (is_date_field_default(field)) {
    return validate_date_field_default(value, field, path);
  } else if (is_array_field_default(field)) {
    return validate_array_field_default(value, field, path);
  } else if (is_object_field_default(field)) {
    return validate_object_field_default(value, field, path);
  } else {
    throw new Error(`Unknown field type: ${field.type}`);
  }
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

// src/lib/bootstrap.ts
var bootstrap = async ({
  root = join(cwd(), "data", "archetypes")
} = {}) => {
  const archetypeSchema = await load_archetype_default("archetype", root.toString());
  const { errors, valid } = validate_archetype_default(archetypeSchema, archetypeSchema);
  if (errors.length === 0 && valid) {
    return {
      archetypeSchema,
      loadArchetype: (name) => load_archetype_default(name, root.toString()),
      validateArchetype: (archetype) => validate_archetype_default(archetype, archetypeSchema)
    };
  }
  throw new Error("Invalid archetype schema", { cause: errors });
};
var bootstrap_default = bootstrap;

export { bootstrap_default as bootstrap };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map