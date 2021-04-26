module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 12,
  //   sourceType: 'module',
  //   project: ['./tsconfig.json'],
  // },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src/', 'node_modules/'],
      },
    },
  },
  rules: {
    'no-console': 0,
    '@typescript-eslint/no-empty-function': 0,
    'prettier/prettier': ['warn'],
    'import/extensions': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'lines-between-class-members': 0,
    'import/no-named-as-default': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-explicit-any': 0,
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'class-methods-use-this': 0,
    'consistent-return': 0,
  },
};
