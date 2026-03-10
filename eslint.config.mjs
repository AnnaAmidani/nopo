import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{ ignores: ['.astro/', 'dist/'] },
	{
		files: ['*.config.mjs', '*.config.js', '*.config.ts'],
		languageOptions: { globals: globals.node },
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
];
