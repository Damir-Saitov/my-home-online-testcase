module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: { ecmaVersion: 2020 },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
    'padded-blocks': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',

    'max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        comments: 100,
        ignoreComments: false,
        ignoreUrls: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: ' +(?:class|d)=".*">?$',
      },
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 2,
        maxEOF: 1,
      },
    ],
    'operator-linebreak': [
      'warn',
      'before',
    ],
    'object-property-newline': [
      'warn',
      { allowAllPropertiesOnSameLine: false },
    ],
    'object-curly-newline': [
      'warn',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
      },
    ],
    'quote-props': [
      'warn',
      'as-needed',
    ],
    quotes: [
      'warn',
      'single',
    ],
    'array-bracket-newline': [
      'warn',
      {
        multiline: true,
        minItems: 3,
      },
    ],
    'object-curly-spacing': [
      'warn',
      'always',
      {
        arraysInObjects: true,
        objectsInObjects: true,
      },
    ],
    'block-spacing': [
      'warn',
      'always',
    ],
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'dot-location': [
      'warn',
      'property',
    ],
    'function-paren-newline': [
      'warn',
      'multiline-arguments',
      // { minItems: 2 },
    ],
    'function-call-argument-newline': [
      'warn',
      'consistent',
    ],
    indent: [
      'warn',
      2,
    ],
    semi: [
      'warn',
      'always',
      { omitLastInOneLineBlock: false },
    ],
    'key-spacing': [
      'warn',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],

    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],

    'vue/first-attribute-linebreak': [
      'warn',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-indent': [
      'warn',
      2,
      { baseIndent: 0 },
    ],
    'vue/order-in-components': [
      'warn',
      {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          [
            'delimiters',
            'comments',
          ],
          'extends',
          'mixins',
          [
            'provide',
            'inject',
          ],
          [
            'components',
            'directives',
            'filters',
          ],
          'model',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          [
            'props',
            'propsData',
          ],
          'emits',
          'setup',
          'asyncData',
          'data',
          'fetch',
          'head',
          'computed',
          'methods',
          'watch',
          'watchQuery',
          'ROUTER_GUARDS',
          'LIFECYCLE_HOOKS',
          [
            'template',
            'render',
          ],
          'renderError',
        ],
      },
    ],
    'vue/attributes-order': [
      'warn',
      {
        order: [
          'CONDITIONALS',
          'LIST_RENDERING',
          'UNIQUE',
          [
            'SLOT',
            'DEFINITION',
          ],
          'RENDER_MODIFIERS',
          'GLOBAL',
          'OTHER_ATTR',
          'EVENTS',
          'TWO_WAY_BINDING',
          'CONTENT',
          'OTHER_DIRECTIVES',
        ],
        alphabetical: false,
      },
    ],
  },
};
