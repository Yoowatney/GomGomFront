import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// 플러그인 import
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier'; // Prettier 연동 설정
import simpleImportSort from 'eslint-plugin-simple-import-sort'; // Import simple-import-sort

export default tseslint.config(
  // 전역으로 무시할 파일/폴더
  {
    ignores: ['dist', 'eslint.config.js'],
  },

  // 모든 JS/TS 파일에 대한 기본 설정
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // 타입 정보가 필요한 추천 규칙 활성화

  // React(TSX) 파일에 대한 설정
  {
    files: ['src/**/*.{ts,tsx}'],
    ...react.configs.flat.recommended, // React 추천 규칙
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort, // Add simple-import-sort plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks 규칙
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // 최신 React에서는 불필요
      'simple-import-sort/imports': 'error', // Enable import sorting
      'simple-import-sort/exports': 'error', // Optional: Enable export sorting
    },
  },

  // 타입 검사 기반 린팅을 위한 설정
  {
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfig,
);