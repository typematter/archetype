---
name: archetype
version: 1.0.0
schema:
  required:
    name:
      type: String
      description: Unique identifier for this archetype
      pattern: ^[a-z][a-z0-9-]*$
    version:
      type: String
      description: Semantic version number
      pattern: ^\d+\.\d+(\.\d+)?$
    schema:
      type: Object
      description: Schema definition containing required and optional field specifications
      properties:
        required:
          type: Object
          description: Fields that must be present in content using this archetype
        optional:
          type: Object
          description: Fields that may be present in content using this archetype
      required: [required, optional]
  optional:
    extends:
      type: String
      description: Name of parent archetype to inherit from
      pattern: ^[a-z][a-z0-9-]*$
---

# Archetype Definition Type

This archetype defines the structure and validation rules for other archetypes in the content system. It serves as both a schema for validating archetypes and a template for creating new ones.

## Core Concepts

### Self-Validation

The archetype archetype validates itself as well as other archetypes. This creates a consistent type system where everything, including type definitions, follows the same patterns and rules.

### Schema Structure

Each archetype must define its schema with two main sections:

1. `required` - Fields that must be present
2. `optional` - Fields that may be present

Each field in either section must specify:

- `type` - The data type of the field
- `description` - Clear documentation of the field's purpose and usage

## Field Definitions

### Required Fields

#### name

The unique identifier for the archetype. This name is used when:

- Referencing the archetype in content
- Specifying extensions
- Generating documentation

Example:

```yaml
name: tutorial
```

Requirements:

- Must start with a lowercase letter
- Can contain lowercase letters, numbers, and hyphens
- Must be unique across all archetypes

#### version

Semantic version number for the archetype. Used to:

- Track schema evolution
- Manage compatibility
- Document changes

Example:

```yaml
version: 1.0.0
```

Requirements:

- Must follow semantic versioning (MAJOR.MINOR.PATCH)
- Major version changes indicate breaking changes
- Minor version changes indicate backwards-compatible additions

#### schema

The core schema definition that describes the structure of content using this archetype. Must contain both `required` and `optional` sections.

Example:

```yaml
schema:
  required:
    title:
      type: String
      description: Page title
  optional:
    description:
      type: String
      description: Brief summary
```

Requirements:

- Must have both `required` and `optional` sections
- Each field must specify type and description
- Types must be valid schema types

### Optional Fields

#### extends

Name of the parent archetype to inherit from. When specified:

- All required fields from parent must be included
- Parent optional fields are automatically available
- Fields can be moved from optional to required
- Field types must be compatible with parent

Example:

```yaml
extends: base
```

## Schema Types

Valid types for schema fields:

- `String` - Text values
- `Number` - Numeric values
- `Boolean` - True/false values
- `Array` - List of values
- `Object` - Nested structure
- `Date` - ISO 8601 date/time

Additional type constraints can be specified:

- `pattern` - Regex pattern for strings
- `enum` - List of valid values
- `min`/`max` - Numeric bounds
- `items` - Schema for array items
- `properties` - Schema for object properties

## Usage Examples

### Minimal Archetype

```yaml
---
name: simple
version: 1.0
schema:
  required:
    title:
      type: String
      description: Page title
  optional: {}
---
```

### Extended Archetype

```yaml
---
name: advanced
version: 1.0
extends: base
schema:
  required:
    category:
      type: String
      enum: [guide, reference, tutorial]
      description: Content category
  optional:
    tags:
      type: Array
      items:
        type: String
      description: Content tags
---
```

## Build Process Integration

This archetype is used during the build process to:

1. Validate archetype definitions
2. Ensure consistent schema structure
3. Verify extension relationships
4. Generate archetype documentation

The validation process:

1. Bootstrap validation of this archetype
2. Validate base archetype
3. Validate all other archetypes
4. Generate final schema registry

## Best Practices

1. Keep schemas focused and minimal
2. Document fields thoroughly
3. Use semantic versioning
4. Plan for evolution
5. Consider extension hierarchy carefully
