const yamlFromMarkdown = (markdown: string): string => {
	const [, yaml] = markdown.split('---\n');

	if (yaml) {
		return yaml;
	}

	throw new Error('YAML content is missing in the file');
};

export default yamlFromMarkdown;
