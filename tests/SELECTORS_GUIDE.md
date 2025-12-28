# Руководство по селекторам в E2E тестах

## Да, можно использовать классы, ID и другие селекторы!

Playwright поддерживает множество типов селекторов. Вы **не обязаны** использовать `data-testid` - это просто рекомендация.

## Типы селекторов

### 1. **data-testid** (Рекомендуется ✅)

```typescript
// В компоненте
<button data-testid="add-to-cart-button">Add to Cart</button>

// В тесте
await page.click('[data-testid="add-to-cart-button"]');
```

**Преимущества:**
- ✅ Не ломается при изменении стилей
- ✅ Не ломается при изменении текста
- ✅ Явно показывает, что элемент используется в тестах
- ✅ Не влияет на production код
- ✅ Стандарт в индустрии

**Недостатки:**
- ❌ Нужно добавлять вручную в каждый компонент

### 2. **CSS класс**

```typescript
// В компоненте
<button className="btn btn-primary add-to-cart">Add to Cart</button>

// В тесте
await page.click('.add-to-cart');
```

**Преимущества:**
- ✅ Уже существует в компонентах
- ✅ Не нужно добавлять дополнительные атрибуты

**Недостатки:**
- ❌ Может измениться при рефакторинге CSS
- ❌ Может использоваться для стилей и конфликтовать
- ❌ При использовании CSS modules классы генерируются автоматически
- ❌ Не понятно, используется ли класс для тестов или стилей

### 3. **CSS ID**

```typescript
// В компоненте
<button id="add-to-cart-btn">Add to Cart</button>

// В тесте
await page.click('#add-to-cart-btn');
```

**Преимущества:**
- ✅ Уникальный на странице
- ✅ Быстрый селектор

**Недостатки:**
- ❌ ID может использоваться для JavaScript логики
- ❌ Может конфликтовать с другими целями
- ❌ Не должно быть несколько одинаковых ID на странице

### 4. **Текст** (text selector)

```typescript
// В компоненте
<button>Add to Cart</button>

// В тесте
await page.click('text=Add to Cart');
```

**Преимущества:**
- ✅ Не нужно добавлять атрибуты
- ✅ Читаемо и понятно

**Недостатки:**
- ❌ Ломается при изменении текста
- ❌ Ломается при локализации
- ❌ Может быть несколько элементов с одинаковым текстом

### 5. **ARIA атрибуты**

```typescript
// В компоненте
<button aria-label="Add product to cart">Add to Cart</button>

// В тесте
await page.click('[aria-label="Add product to cart"]');
```

**Преимущества:**
- ✅ Улучшает доступность (a11y)
- ✅ Семантически правильно
- ✅ Двойная польза: тесты + доступность

**Недостатки:**
- ❌ Может измениться для улучшения доступности
- ❌ Нужно добавлять вручную

### 6. **Role селекторы** (Лучший для доступности ✨)

```typescript
// В компоненте
<button>Add to Cart</button>

// В тесте
await page.getByRole('button', { name: 'Add to Cart' }).click();
```

**Преимущества:**
- ✅ Не нужно добавлять атрибуты
- ✅ Тестирует доступность
- ✅ Семантически правильно
- ✅ Рекомендуется Playwright

**Недостатки:**
- ❌ Ломается при изменении текста
- ❌ Требует правильной семантической разметки

### 7. **Комбинированные селекторы**

```typescript
// В компоненте
<div class="cart-drawer">
  <button class="checkout-btn">Checkout</button>
</div>

// В тесте
await page.click('.cart-drawer .checkout-btn');
await page.locator('.cart-drawer').locator('.checkout-btn').click();
```

## Примеры для вашего проекта

### Вариант 1: Использовать существующие классы

```typescript
// test-data.ts
export const SELECTORS = {
  // Используем существующие классы из вашего проекта
  cartIcon: '.cart-icon', // или какой у вас класс
  addToCartButton: '.btn-add-to-cart',
  productCard: '.product-card',
} as const;
```

**Найдите классы в ваших компонентах:**
```bash
# Найти класс иконки корзины
grep -r "className.*cart" components/layout/header/
```

### Вариант 2: Использовать ID

```typescript
// В компоненте добавьте ID
<button id="cart-icon" onClick={openCart}>
  <CartIcon />
</button>

// test-data.ts
export const SELECTORS = {
  cartIcon: '#cart-icon',
} as const;
```

### Вариант 3: Использовать role (рекомендуется Playwright)

```typescript
// В тесте напрямую
await page.getByRole('link', { name: /cart/i }).click();
await page.getByRole('button', { name: 'Add to Cart' }).click();
```

### Вариант 4: Смешанный подход (практично)

```typescript
export const SELECTORS = {
  // data-testid для критичных элементов
  cartIcon: '[data-testid="cart-icon"]',

  // Классы для элементов, которые уже есть
  productCard: '.product-card',

  // Role для кнопок и ссылок
  // (используются напрямую в тестах через getByRole)
} as const;
```

## Что выбрать для вашего проекта?

### Рекомендация 1: Используйте существующие классы (быстрый старт)

Если у вас уже есть стабильные классы:

```typescript
// test-data.ts
export const SELECTORS = {
  cartIcon: 'a[href*="/cart"]', // Ссылка на корзину
  addToCartButton: '.btn-add-to-cart', // Кнопка добавления
  productCard: '.product-card',
  cartBadge: '.cart-badge', // Badge счётчика
} as const;
```

**Проверьте, какие классы используются:**

```typescript
// Откройте браузер и в консоли:
document.querySelector('.product-card') // Проверить, существует ли
```

### Рекомендация 2: Гибридный подход (баланс)

```typescript
export const SELECTORS = {
  // Для критичных элементов используйте data-testid
  cartBadge: '[data-testid="cart-badge"]',

  // Для остальных - существующие классы/структуру
  productCard: '.product-card',
  cartIcon: 'a[href*="/cart"]',
} as const;
```

### Рекомендация 3: Role-based (современный подход)

Используйте методы Playwright напрямую без SELECTORS:

```typescript
// cart.spec.ts
test('add to cart', async ({ page }) => {
  // Найти по роли и названию
  await page.getByRole('button', { name: /add to cart/i }).click();

  // Найти ссылку корзины
  await page.getByRole('link', { name: /cart/i }).click();

  // Найти по тексту
  await page.getByText('Checkout').click();
});
```

## Примеры замены для вашего проекта

### Найдите классы в NavItemCart:

```typescript
// components/layout/header/nav/NavItemCart.tsx
// Вместо добавления data-testid, используйте существующую структуру:

// Было:
cartIcon: '[data-testid="cart-icon"]',

// Можно:
cartIcon: 'a[href*="/cart"]', // Селектор по href
// или
cartIcon: '.cart-link', // Если есть такой класс
```

### Используйте инспектор браузера

1. Откройте сайт в браузере
2. Нажмите F12 (DevTools)
3. Инспектируйте элемент (Ctrl+Shift+C)
4. Посмотрите классы, ID, атрибуты
5. Используйте их в тестах

## Практический пример

```typescript
// Вместо data-testid можно использовать:

// 1. Класс из продакшн кода
await page.locator('.product-card').first().click();

// 2. Комбинацию классов
await page.locator('.header .cart-link').click();

// 3. Атрибут href
await page.locator('a[href="/en/cart"]').click();

// 4. Role + name
await page.getByRole('link', { name: /cart/i }).click();

// 5. Text
await page.locator('text=Add to Cart').click();
```

## Итог: Что делать?

### ✅ Быстрый старт (используйте существующие классы)

1. Откройте `test-data.ts`
2. Замените селекторы на классы из ваших компонентов
3. Запустите тесты
4. Если ломаются - используйте более стабильные селекторы

### ✅ Лучший подход (комбинированный)

1. Для **критичных элементов** (cart, checkout) - добавьте `data-testid`
2. Для **некритичных** - используйте классы или role
3. Постепенно улучшайте

### ✅ Самый простой (role-based)

Не используйте SELECTORS вообще, пишите напрямую:

```typescript
test('add to cart', async ({ page }) => {
  // Playwright автоматически найдёт кнопку по тексту
  await page.getByRole('button', { name: 'Add to Cart' }).click();
});
```

## Нужна помощь?

Покажите мне класс или структуру вашего компонента, и я помогу выбрать правильный селектор!

Например:
```bash
# Покажите компонент корзины
cat components/layout/header/nav/NavItemCart.tsx
```

И я скажу, какой селектор лучше использовать для ваших тестов.
