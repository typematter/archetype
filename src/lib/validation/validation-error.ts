import type { ValidationError } from '$types/validation-error.js';

const validationError: (message: string, path?: string[]) => ValidationError = (
	message,
	path = []
) => ({
	message,
	path
});

export default validationError;
