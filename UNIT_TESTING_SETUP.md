# Unit Testing Setup Guide

## Что было сделано

### 1. Установлены зависимости ✅

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui @vitest/coverage-v8
```

### 2. Созданы конфигурационные файлы ✅

- `vitest.config.ts` - конфигурация Vitest
- `vitest.d.ts` - TypeScript типы для Vitest globals
- `tsconfig.vitest.json` - специальный tsconfig для тестов
- `tests/unit-setup.ts` - setup файл для тестов

### 3. Добавлены скрипты в package.json ✅

```json
{
  "scripts": {
    "vtest": "vitest",
    "vtest:ui": "vitest --ui",
    "vtest:watch": "vitest --watch",
    "vtest:coverage": "vitest --coverage"
  }
}
```

### 4. Созданы примеры тестов ✅

- `components/utils/__tests__/utils.test.ts` - тесты утилит (UsePrice, UseDate, и др.)
- `components/layout/products-grid/components/product-card/__tests__/PriceDisplay.test.tsx` - тесты компонента
- `app/store/reducers/__tests__/CartSlice.test.ts` - тесты Redux slice

## Проблема

Vitest не может найти тесты из-за конфликта с конфигурацией Next.js 16 (`jsxRuntime: 'react-jsx'` vs Vitest ожидания).

## Решения

### Вариант 1: Использовать Jest вместо Vitest (Рекомендуется для Next.js)

```bash
# Удалить Vitest
npm uninstall vitest @vitejs/plugin-react @vitest/ui @vitest/coverage-v8

# Установить Jest
npm install -D jest jest-environment-jsdom @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest
```

Создать `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/e2e/'],
}

module.exports = createJestConfig(customJestConfig)
```

### Вариант 2: Исправить Vitest конфигурацию

Обновить `vitest.config.ts`:

```typescript
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit-setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```

### Вариант 3: Hybrid подход (E2E + Component tests)

Использовать Playwright для component testing:

```bash
npm install -D @playwright/experimental-ct-react
```

## Структура тестов

```
project/
├── components/
│   └── utils/
│       ├── utils.ts
│       └── __tests__/
│           └── utils.test.ts
├── app/
│   └── store/
│       └── reducers/
│           ├── CartSlice.ts
│           └── __tests__/
│               └── CartSlice.test.ts
└── tests/
    ├── unit-setup.ts
    └── e2e/
```

## Примеры тестов

### Утилита (utils.test.ts)

```typescript
import { describe, expect, it } from 'vitest'
import { UsePrice } from '../utils'

describe('UsePrice', () => {
  it('should format price in USD', () => {
    const result = UsePrice({ amount: 1000, lang: 'en' })
    expect(result).toBe('$1,000.00')
  })
})
```

### React компонент (PriceDisplay.test.tsx)

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PriceDisplay from '../PriceDisplay'

describe('PriceDisplay', () => {
  it('should display price', () => {
    render(<PriceDisplay attributeValues={{ sale: { value: 100 } }} lang="en" />)
    expect(screen.getByTestId('product-price')).toBeInTheDocument()
  })
})
```

### Redux slice (CartSlice.test.ts)

```typescript
import { describe, expect, it } from 'vitest'
import cartReducer, { addProductToCart } from '../CartSlice'

describe('CartSlice', () => {
  it('should add product to cart', () => {
    const state = cartReducer(
      initialState,
      addProductToCart({ id: 1, selected: true, quantity: 2 })
    )
    expect(state.productsData).toHaveLength(1)
  })
})
```

## Следующие шаги

1. Выбрать один из вариантов решения
2. Запустить тесты: `npm run vtest` (или `npm test` для Jest)
3. Добавить coverage: `npm run vtest:coverage`
4. Интегрировать в CI/CD

## Полезные ссылки

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing/vitest)
- [Jest with Next.js](https://nextjs.org/docs/app/building-your-application/testing/jest)
