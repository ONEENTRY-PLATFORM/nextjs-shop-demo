[Back to README](../README.md)

# How the user's state is implemented in the app?

## What is the User State?

The **user state** refers to the combination of client-side Redux state and server-side user data. It includes user preferences like favorites and cart items, which are synchronized with the server. For more information about users: [Users Documentation](http://doc.oneentry.cloud/docs/category/users).

## Structure of the User State

In our application, the user state contains several key pieces of data:

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

3. **Order Data**
    - Form data collected during the order creation process
    - Selected payment method
    - Products to be ordered

4. **Form Validation State**
    - Validation status of form fields
    - Current values of form fields

## Managing the User State in the Application

To manage the user state within the application, we use Redux slices in combination with RTK Query:

- **CartSlice**: Manages cart items and delivery information
- **FavoritesSlice**: Manages user's favorite products
- **OrderSlice**: Manages order creation process data
- **FormFieldsSlice**: Manages form validation state
- **RTK Query**: Manages server state and API interactions

Each slice provides:

- **Actions**: Functions to modify the state
- **Reducers**: Functions that handle state changes
- **Selectors**: Helper functions to extract specific parts of the state from the Redux store

## Synchronizing the User State with the Server

The Redux state manages the user state locally within the application, but it needs to be synchronized with the server to persist changes across sessions.

### How It Works

1. The synchronization logic is implemented in the **[AuthContext]** using useEffect hooks.
2. Whenever there is a change in the Redux state (e.g., adding/removing favorites or modifying the cart), the system triggers an API call to update the user's state on the server.
3. This is done by tracking version numbers in the Redux slices and comparing them with server versions.
4. When discrepancies are detected, the client state is synchronized with the server.

### Key Implementation Details

- Uses localStorage to persist state between sessions via redux-persist
- Tracks version numbers to detect when synchronization is needed
- Automatically syncs when the user data is refreshed
- Handles both uploading client changes to the server and downloading server changes to the client

[AuthContext]: ../app/store/providers/AuthContext.tsx