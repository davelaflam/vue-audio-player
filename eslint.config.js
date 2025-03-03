const eslintConfig = async () => {
  const eslintPluginVue = (await import('eslint-plugin-vue')).default
  const typescriptEslintPlugin = (await import('@typescript-eslint/eslint-plugin')).default
  const typescriptEslintParser = (await import('@typescript-eslint/parser')).default
  const eslintPluginPrettier = (await import('eslint-plugin-prettier')).default
  const eslintPluginJsdoc = (await import('eslint-plugin-jsdoc')).default // Import eslint-plugin-jsdoc

  return [
    {
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: (await import('vue-eslint-parser')).default, // Ensure vue-eslint-parser is imported dynamically
        parserOptions: {
          parser: typescriptEslintParser,
          ecmaVersion: 2020,
          sourceType: 'module',
          extraFileExtensions: ['.vue'],
        },
        globals: {
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          fbq: 'readonly',
          google: 'readonly',
          withDefaults: 'readonly',
        },
      },
      plugins: {
        vue: eslintPluginVue,
        '@typescript-eslint': typescriptEslintPlugin,
        prettier: eslintPluginPrettier,
        jsdoc: eslintPluginJsdoc, // Add jsdoc plugin
      },
      rules: {
        'prettier/prettier': [
          'warn',
          {
            endOfLine: 'auto',
            printWidth: 120,
            semi: false,
            singleQuote: true,
          },
        ],
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single'],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        'vue/multi-word-component-names': 'off',
        semi: 0,
        'prefer-const': 'error',

        // JSDoc rules
        'jsdoc/check-alignment': 'warn', // Check JSDoc block alignment
        'jsdoc/check-param-names': 'warn', // Check parameter names in JSDoc
        'jsdoc/check-tag-names': 'warn', // Check tag names in JSDoc
        'jsdoc/check-types': 'warn', // Check types in JSDoc
        'jsdoc/require-param': 'warn', // Require parameters in JSDoc
        'jsdoc/require-param-description': 'warn', // Require parameter descriptions in JSDoc
        'jsdoc/require-param-type': 'warn', // Require parameter types in JSDoc
        'jsdoc/require-returns-description': 'warn', // Require return descriptions in JSDoc
        'jsdoc/require-returns-type': 'warn', // Require return types in JSDoc
      },
    },
  ]
}

export default await eslintConfig()
