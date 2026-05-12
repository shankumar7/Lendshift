module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    cy: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    beforeEach: 'readonly',
    expect: 'readonly',
    Cypress: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@pages', './src/pages'],
          ['@hooks', './src/hooks'],
          ['@utils', './src/utils'],
          ['@store', './src/store'],
          ['@services', './src/services'],
          ['@routes', './src/routes'],
          ['@constants', './src/constants'],
          ['@layouts', './src/layouts'],
          ['@styles', './src/styles'],
          ['@forms', './src/forms'],
          ['@schemas', './src/schemas'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
};
