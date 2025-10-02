[Back to README](../README.md)

# State Management Documentation

This document describes the state management approach used in the OneEntry Next.js Shop project.

## Overview

The project uses Redux Toolkit with React-Redux for state management. This includes server state management with RTK Query for data fetching and client state management with Redux slices. State persistence is implemented using redux-persist to save state in localStorage.

## Redux Store Structure

The Redux store is organized into several slices:

1. **Cart Slice** - Manages shopping cart items and delivery information
2. **Favorites Slice** - Manages user's favorite products
3. **Order Slice** - Manages order creation process data
4. **Form Fields Slice** - Manages form validation state

Additionally, RTK Query is used for server state management with endpoints for various OneEntry CMS entities.

## Server State Management

RTK Query is used for server state management through the [RTKApi](file://d:\OneEntry\oneentry-next-shop\app\api\api\RTKApi.ts#L67-L67), providing:

- Automatic caching
- Background data fetching
- Mutation management
- Optimistic updates
- Pagination support

API services are defined in the `app/api/api/RTKApi.ts` file, with each service corresponding to a specific OneEntry CMS module.

Key hooks provided by RTK Query include:

- User authentication and session management
- Product and category data fetching
- Order management
- Form handling
- Content blocks and pages

## Client State Management

Client state is managed through Redux slices located in `app/store/reducers`. Each slice includes:

- Initial state definition
- Reducers for state updates
- Action creators for dispatching updates

### Cart Slice

Manages the shopping cart state including:

- Product items with quantities
- Delivery information (date, time, address)
- Currency settings
- Total calculation

### Favorites Slice

Manages the user's favorite products:

- Array of product IDs
- Version tracking for synchronization

### Order Slice

Manages the order creation process:

- Form data collection
- Product items for the order
- Payment method selection

### Form Fields Slice

Manages form validation state:

- Field values
- Validation status for each field

## Store Providers

The application uses several React context providers to manage different aspects of state:

### StoreProvider

The main Redux store provider that wraps the entire application. It initializes the Redux store with persistence using redux-persist.

### AuthProvider

Manages user authentication state and provides authentication-related functions. It handles:

- User session management
- Token refresh
- User data synchronization with the server

### ServerProvider

Manages server-side data using React's cache function and makes it available to client components. This is a server-only context for sharing data between server components.

### OpenDrawerProvider

Manages the state of various UI drawers and modals including:

- Open/closed state
- Component to display
- Transition animations

## State Persistence

Client state is persisted using redux-persist with localStorage as the storage engine. The following parts of state are persisted:

- Cart products and delivery data
- Favorites list
- Order form data
- Form validation state

Each slice configures its own persistence settings with specific whitelisted fields.

## Usage Examples

### Accessing State in Components

```tsx
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';

const MyComponent = () => {
  const cartItems = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  
  const addToCart = (product) => {
    dispatch(addToCart(product));
  };
  
  return (
    // Component JSX
  );
};
```

### Defining a Slice

```ts
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Reducer logic
    }
  }
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
```

### Creating API Services

```ts
import { api } from './index';

const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: (params) => ({
        url: 'products',
        params
      })
    })
  })
});

export const { useGetProductsQuery } = productsApi;
```

## Best Practices

1. Use selectors to access state data instead of accessing state directly
2. Keep reducers pure and synchronous
3. Use RTK Query for server state and Redux for client state
4. Normalize data in the store to avoid duplication
5. Use appropriate loading and error states in components
6. Clean up subscriptions and listeners when components unmount
7. Configure persistence carefully to only store necessary data
