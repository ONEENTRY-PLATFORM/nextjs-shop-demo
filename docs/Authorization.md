[Back to README](../README.md)

# Authorization Documentation

Authorization is a critical component of the system. Without it, many features are inaccessible because they require a **JWT session token**.

## How It Works

1. **JWT Tokens**
    - **`accessToken`**:
      - Used for API requests.
      - Short-lived and frequently refreshed.
    - **`refreshToken`**:
        - Stored securely (e.g., in `localStorage`).
        - Changes every 30 days or upon re-authentication.

2. **SDK Handles Tokens**
    - Most token management is handled by the **OneEntry SDK**.
    - You only need to pass the `refreshToken` during SDK initialization:

      ```typescript
      reDefine(refreshToken, langCode);
      ```

## AuthContext

All authorization logic, including login and registration, is located in the **AuthContext**. This is a React context that centralizes authentication workflows.

- **Usage**:
  - The `AuthContext` wraps the entire application in `layout.tsx`:

      ```tsx
      <AuthProvider langCode={langCode}>
        <App />
      </AuthProvider>
      ```

  - Components outside the context cannot use its features.

### Key Features

- User session management
- Token refresh handling
- User data synchronization with server
- Authentication state tracking
- Integration with Redux for user-related state

### Implementation Details

The AuthProvider component:

1. Manages authentication state (isAuth, isLoading, user)
2. Handles token initialization from localStorage
3. Provides authentication functions (authenticate, refreshUser)
4. Synchronizes user data (cart, favorites) with the server
5. Uses polling to keep user session alive
