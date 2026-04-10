import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    ignores: ['src/generated/**'],
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]
