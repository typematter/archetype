[![Node.js Package](https://github.com/typematter/archetype/actions/workflows/release-package.yml/badge.svg)](https://github.com/typematter/archetype/actions/workflows/release-package.yml)

# Archetype

Archetype is a robust TypeScript library designed to define, load, and manage content schemas through archetypes. It supports both local and remote schema sources, ensuring flexibility and scalability for your content systems.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating a local store](#creating-a-local-store)
  - [Creating a remote store](#creating-a-remote-store)
  - [Loading an archetype](#loading-an-archetype)
  - [Validating an archetype](#validating-an-archetype)
  - [Validating frontmatter](#validating-frontmatter)
- [API documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Flexible Schema Loading**: Supports loading archetype schemas from both local markdown files and remote URLs.
- **Robust Error Handling**: Custom error classes provide clear and specific error messages.
- **Type-Safe**: Built with TypeScript to ensure type safety across your project.
- **Extensible Architecture**: Easily extend or modify to fit your project's needs.
- **Self-Validation**: Archetypes can validate themselves and others, maintaining consistency.

## Installation

```bash
npm install archetype
```

## Usage

### Creating a local store

```typescript
import { createLocalStore } from '@accuser/archetype';

const localStore = createLocalStore('/path/to/archetypes');

await localStore
	.load('post')
	.then((archetype) => {
		console.log('Loaded archetype:', archetype);
	})
	.catch((error) => {
		console.error(error);
	});
```

### Creating a remote store

```typescript
import { createRemoteStore } from '@accuser/archetype';

const remoteStore = createRemoteStore('https://example.com/archetypes');

await remoteStore
	.load('post')
	.then((archetype) => {
		console.log('Loaded archetype:', archetype);
	})
	.catch((error) => {
		console.error(error);
	});
```

### Loading an archetype

```typescript
import { createValidator } from '@accuser/archetype';

const validator = createValidator({
	store: localStore
});

const postArchetype = await validator.loadArchetype('post');
```

### Validating an archetype

```typescript
const validationResult = await validator.validateArchetype(postArchetype);
```

### Validating frontmatter

```typescript
const frontmatter = {
	title: 'Hello, World!',
	date: '2021-01-01'
};

const validationResult = await validator.validateFrontmatter(frontmatter, 'post');
```

## API documentation

### Interfaces

#### `Archetype`

```typescript
interface Archetype {
	name: string;
	version: string;
	schema: {
		required: Record<string, SchemaField>;
		optional: Record<string, SchemaField>;
	};
	extends?: string[];
}
```

- `name`: The name of the archetype.
- `version`: The version of the archetype.
- `schema`: The schema fields.
- `extends`: The name(s) of the archetype(s) this archetype extends.

#### `ArchetypeStore`

```typescript
interface ArchetypeStore {
	load(name: string): Promise<Archetype>;
}
```

- `load`: Loads an archetype schema by name.

#### `ArchetypeValidator`

```typescript
interface ArchetypeValidator {
	readonly archetypeSchema: Readonly<Archetype>;
	loadArchetype: (name: string) => Promise<Archetype>;
	validateArchetype(archetype: unknown): Promise<ValidationResult>;
	validateFrontmatter: (
		frontmatter: unknown,
		defaultArchetypeName?: string
	) => Promise<ValidationResult>;
}
```

- `archetypeSchema`: The archetype schema.
- `loadArchetype`: Loads an archetype schema by name.
- `validateArchetype`: Validates an archetype object.
- `validateFrontmatter`: Validates frontmatter data.

#### `ValidationError`

```typescript
interface ValidationError {
	message: string;
	path: string[];
}
```

- `message`: The error message.
- `path`: The path to the error.

#### `ValidationResult`

```typescript
interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}
```

- `valid`: Whether the validation passed.
- `errors`: An array of validation errors.

#### `ValidatorOptions`

```typescript
interface ValidatorOptions {
	store: ArchetypeStore;
	cache?: boolean;
	validation?: {
		strictMode?: boolean;
		allowUnknownFields?: boolean;
	};
}
```

- `store`: The archetype store.
- `cache`: Whether to cache loaded archetypes.
- `validation`: Validation options.
  - `strictMode`: Whether to enforce strict mode.
  - `allowUnknownFields`: Whether to allow unknown fields.

### Classes

#### `ArchetypeLoadError`

```typescript
class ArchetypeLoadError extends Error {
	constructor(message: string, cause?: unknown);
}
```

- `message`: The error message.
- `cause`: The underlying cause of the error.

#### `LocalArchetypeLoadError`

```typescript
class LocalArchetypeLoadError extends ArchetypeLoadError {
	constructor(message: string, cause?: unknown);
}
```

- `message`: The error message.
- `cause`: The underlying cause of the error.

#### `RemoteArchetypeLoadError`

```typescript
class RemoteArchetypeLoadError extends ArchetypeLoadError {
	constructor(message: string, statusText? string);
}
```

- `message`: The error message.
- `statusText`: The status text of the HTTP response.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

Please ensure your code follows the project's coding standards and include relevant tests.

## License

[MIT](./LICENSE)

## Contact

For questions or support, please open an issue on the GitHub repository.
