// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Basic rules
      '@typescript-eslint/no-explicit-any': 'off',
      // Tắt rule cũ để tránh conflict
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Plugin để tự động xóa unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { 
          'vars': 'all', 
          'varsIgnorePattern': '^_', 
          'args': 'after-used', 
          'argsIgnorePattern': '^_' 
        }
      ],
    },
  },
);
