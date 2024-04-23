/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	globals: {
		$$Generic: 'readonly',
	},
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ varsIgnorePattern: '^\\$\\$(Props|Events|Slots)$' },
		],
		'no-console': 'error',
	},
}
