[Back to README](../README.md)

# How the user's state is implemented in the app?

## What is the User State?

The **user state** is an object associated with each user. It allows you to store custom data for a user, and you can update it using the `updateUser` API endpoint. For more information about users: [Users Documentation](http://doc.oneentry.cloud/docs/category/users).

---

## Structure of the User State

In our application, the user state contains two main fields:

1. **Favorites**
    - A simple array of IDs representing the user's favorite items.
    - Example: `[1, 2, 3]`

2. **Cart**
    - An array of objects, where each object represents an item in the cart. Each object has the following structure:
    - Example:

      ```json
      [
        { "id": 1, "quantity": 2, "selected": true },
        { "id": 2, "quantity": 1, "selected": false }
      ]
      ```

---

## Managing the User State in the Application

To manage the user state within the application, we use the **[userStateSlice]** in Redux. This slice provides:

- **Actions**: Functions to modify the cart and favorites.
- **Selectors**: Helper functions to extract specific parts of the state from the Redux store.

---

## Synchronizing the User State with the Server

While the Redux state manages the user state locally within the application, it does not automatically synchronize with the server.
To ensure that changes in the local state are reflected on the server look at **[useSyncUserState]** hook.

### How It Works

1. The [useSyncUserState] hook is called inside the **[AuthContext]**.
2. Whenever there is a change in the Redux state (e.g., adding/removing favorites or modifying the cart), the hook triggers an API call to update the user's state on the server.
3. This ensures that the local state and the server state are always in sync.

[useSyncUserState]: ../src/hooks/shared/useSyncUserState.ts
[userStateSlice]: ../src/state/reducers/userStateSlice.ts
[AuthContext]: ../app/store/providers/AuthContext.tsx
