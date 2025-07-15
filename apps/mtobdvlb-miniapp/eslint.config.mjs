import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import json from '@eslint/json'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'
import pinia from 'eslint-plugin-pinia'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: globals.browser
    },
    plugins: {
      js,
      prettier,
      vue: pluginVue
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginVue.configs['flat/essential'].rules,
      ...pinia.configs.recommended.rules,
      'prettier/prettier': 'error' // 强制执行 Prettier 格式
    }
  },

  // Vue 文件专属配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },

  // JSON 文件
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json',
    extends: ['json/recommended']
  },

  // CSS 文件
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css',
    extends: ['css/recommended']
  }
])
