module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
  },
}
