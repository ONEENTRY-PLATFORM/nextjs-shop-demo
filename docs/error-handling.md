# Error Handling in OneEntry Next.js Shop

This document describes the error handling approach used in the OneEntry Next.js Shop project.

## Overview

The project uses a centralized error handling system located in `app/utils/errorHandler.ts`. This system provides consistent error handling across the application, with special handling for API errors from the OneEntry CMS.

## Core Components

### ApiError Class

A custom error class that extends the standard JavaScript Error class. It includes:

- `message`: Error message
- `statusCode`: HTTP status code (default: 500)
- `originalError`: Original error object

### isIError Function

A TypeScript type guard that checks if an object conforms to the IError interface from OneEntry SDK.

```typescript
function isIError(error: unknown): error is IError
```

### handleApiError Function

Centralized error handling function that:

1. Identifies the type of error
2. Creates a standardized ApiError object
3. Logs the error for debugging
4. Returns the standardized error

### useApiErrorHandler Hook

A React hook that provides error handling with toast notifications.

### formatErrorMessage Function

Formats error messages for user display based on error type and status code.

## Usage Examples

### In API Service Functions

```typescript
import { handleApiError, isIError } from '@/app/utils/errorHandler';

try {
  const data = await api.Products.getProducts(params);
  
  if (isIError(data)) {
    return { isError: true, error: data };
  }
  
  return { isError: false, data };
} catch (error) {
  const apiError = handleApiError(error);
  return { isError: true, error: apiError };
}
```

### In React Components

```typescript
import { useApiErrorHandler } from '@/app/utils/errorHandler';

const MyComponent = () => {
  const handleApiError = useApiErrorHandler();
  
  const fetchData = async () => {
    try {
      const result = await apiCall();
      // Handle success
    } catch (error) {
      handleApiError(error);
    }
  };
  
  return (...);
};
```

### With User-Friendly Messages

```typescript
import { formatErrorMessage } from '@/app/utils/errorHandler';

try {
  await apiCall();
} catch (error) {
  const userMessage = formatErrorMessage(error, 'Failed to perform action');
  setError(userMessage);
}
```

## Error Logging

All errors are automatically logged to the console with relevant information including:
- Error message
- Status code (for API errors)
- Stack trace (for JavaScript errors)
- Timestamp

In production, you might want to integrate with a proper error tracking service like Sentry.

## Best Practices

1. Always use the centralized error handler instead of custom error handling
2. Use `isIError` type guard when checking for OneEntry API errors
3. Provide user-friendly error messages using `formatErrorMessage`
4. Log errors appropriately for debugging
5. Handle errors at the appropriate level (component or service)