[Back to README](../README.md)

# Events Documentation

## What Are Events?

Events are used to notify users about changes in specific entities or processes. In our application, notifications are delivered via **Push Notifications** and **WebSocket**. Learn more about events: [Events Documentation](https://doc.oneentry.cloud/docs/category/events).
[SDK WS Documentation](https://js-sdk.oneentry.cloud/docs/category/ws).

## How Events Work

### 1. **Subscription Requirements**

- Some events are subscribed to automatically (e.g., order updates).
- Others require manual subscription via a request to **OneEntry** (e.g., product status changes).

### 2. **Example: Product Subscription**

- When a user adds a product to their favorites, they are automatically subscribed to an event that notifies them when the product becomes available.
- The event is configured in the CMS to trigger notifications based on specific conditions.

## Handling Notifications

- **Push Notifications**:

  - Handled by the notification system in the **[AuthContext]** using the useNotifications hook.
  - This ensures that push notifications are processed consistently across the application.

- **WebSocket Notifications**:

  - Handled by the **useWebSocket** hook.
  - This hook listens for real-time updates and triggers appropriate actions in the app.

## Implementation Details

The event system is implemented using:

1. **WebSocket connections** for real-time updates
2. **Notification hooks** for displaying messages to users
3. **Event subscription management** in the OneEntry CMS

The useWebSocket hook manages the WebSocket connection and processes incoming messages, while the notification system in AuthContext handles displaying those messages to the user via toast notifications.

[useWebSocket]: ../app/api/hooks/useEvents.ts
