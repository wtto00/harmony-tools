import type { Linter } from 'eslint'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { ...pluginJs.configs.recommended },
  ...tseslint.configs.recommended.map((config) => {
    config.ignores = ['src-tauri/**/*']
    return config
  }),
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      'vue/multi-word-component-names': [0],
    },
  },
  {
    rules: {
      'no-case-declarations': [0],
    },
  },
] as Linter.Config[]
