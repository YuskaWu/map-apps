module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'google'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 'off',
    'require-jsdoc': 'off',
    'max-len': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
