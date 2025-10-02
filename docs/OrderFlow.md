[Back to README](../README.md)

# How the order creation process works in the app?

Orders is one of the main modules of OneEntry CMS.
In this application it is implemented for making purchases in the shop. More about the orders: <https://doc.oneentry.cloud/docs/category/orders>
It is a complex process, let's take a look at it.

1. Order Initialization: Generates an order based on the user's cart contents.
2. Delivery Setup : The user specifies delivery preferences and provides required shipping details (e.g., address, date and time).
3. Payment : The user chooses a payment method:
   Stripe for online transactions.
   Cash on delivery for in-person payment.

Additionally, each component's functionality described detailed via JSDoc inside of it.

## Step 1: Order Initialization

Once on the order preparation page, pay attention to two key components: ItemsInOrderList which displays a list of items and contains some logic and OrderForm which will be discussed in the next step.

- The ItemsInOrderList component utilizes custom logic to prepare the order data.
- This logic initializes the order data in **Redux**, formatting it for seamless further processing.
- In addition to the selected products from the cart, it adds **shipping** product.
- The `id` of the `shipping` product must be predefined in the `.env` file.
- Example `.env` entry:

```env
  PING_PRODUCT_ID=12345
```

The order data is managed in the OrderSlice Redux slice which contains:

- Form data for collecting user information
- Product items to be ordered
- Payment method selection

## Step 2: Delivery Setup

### Fetching the Order Form with OrderForm

- The OrderForm component retrieves the form structure for the order from the CMS.
- This includes all fields that can be filled out by the user and will later be saved with the order.
- Pay attention to the **date field**. It implements an attribute of the interval type from the CMS. It allows for flexible customization of defining delivery time slots.
- As the user fills out the form, the entered data is dynamically added to the order in **Redux** using the FormFieldsSlice.

### Proceeding to Payment with GoToPayButton

- Once all required fields are completed, the user can proceed to the next step using the **GoToPayButton** component.
- This button triggers navigation to the payment stage

## Step 3: Payment

### Payment Methods Selection

- On the CreateOrderScreen, the available payment methods are fetched from the CMS.
- The user can select their preferred payment method (e.g., **Stripe** or **Cash**).
- Once selected, the chosen payment method is added to **Redux** in the OrderSlice for further processing.

### Confirming Order Details

- Once all required order information has been collected, the user can finalize the order creation process.
- When the user confirms the order, the logic of order creation in the CMS is triggered using the useCreateOrder hook.
- If **Stripe** is selected as the payment method:
  - A payment session is created using the `createSession` function.
  - This session handles the payment flow through Stripe's API.

### Payment Process with Stripe

- When a user selects **Stripe** as the payment method, they are redirected to the PaymentPayScreen. Here's how it works:
- It creates a Stripe checkout session
- Redirects the user to Stripe's payment page
- Handles the success/cancel callbacks

### Order Creation Process Complete

The order creation process is fully implemented, supporting both **Stripe** and **Cash** for a seamless user experience.
