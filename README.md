<img src="https://oneentry.cloud/img/git/oneenrty_light.png" alt="OneEntry Headless CMS" width="200" />

# OneEntry next.js shop example

[App Promo Page](https://oneentry-free-template-e-commerce-nextjs.vercel.app 'DEMO')

# OneEntry Headless CMS E-commerce Template

This project is a demo version of an e-commerce store, fully integrated with OneEntry Headless CMS. The primary goal of this project is to provide developers with a free, ready-to-use front-end template that demonstrates the capabilities of working with OneEntry.

## Project Goals

1. **Showcase OneEntry’s Capabilities**: This e-commerce template gives users a clear example of how OneEntry Headless CMS can be used to manage content and products on an online store.

2. **Simplify Development for Front-End Developers**: This project serves as a foundation that developers can use to quickly set up an e-commerce store. They can use the code as-is or customize it, adapting the design and adding their own features, which significantly reduces development time.

3. **Ready-to-Use Solution for Quick Start**: This e-commerce template isn’t just an example—it’s a fully functional codebase that’s already integrated with OneEntry Headless CMS, ready to be tailored to fit specific project needs.

## Key Features

- **Full Control via Admin Panel**: Every element of the store—from product cards to category pages—is customizable and manageable through an intuitive admin panel. This setup allows for quick content updates and store adjustments without needing code changes.

- **Flexible Content Management**: All content, including product descriptions, images, pricing, and promotions, is managed entirely through the OneEntry admin panel. This makes it easy to keep the store up-to-date, working exclusively through the admin interface.

- **Quick Start & Easy Adaptation**: Developers can hit the ground running with this ready-made template and customize it as needed to meet specific business or branding requirements.

- **Scalability Support**: With OneEntry Headless CMS, this store can easily scale, handling high traffic and growing data volumes, making it suitable for both small projects and larger stores.

## Usage

This project is designed for developers using OneEntry Headless CMS who need a quick and flexible way to launch an e-commerce store. It serves as a starting point for creating a custom online store with minimal time and effort on front-end development.

## Demo

[https://oneentry-nextjs-e-commerce-demo.vercel.app/](https://oneentry-nextjs-e-commerce-demo.vercel.app/ 'DEMO')

## Features

- **User creation:** Register users via different providers (email, phone) and customize which data to store.
- **User Activation:** Activate users via code, such as through email verification.
- **State Management:** Utilize Redux Toolkit and Server state for effective state management.
- **Efficient Store Catalog:** Easily manage an unlimited number of products in the catalog.
- **Dynamic Catalog Updates:** Reload the catalog, with direct editing capabilities in the CMS.
- **Advanced Filtering:** Apply a variety of filters to the product catalog for better organization and search.
- **Editable Block Content:** Support for user-editable block content.
- **Product Recommendations:** Display various selections of products.
- **Feedback Forms:** Include customizable feedback forms with captcha protection to prevent spam.
- **Order Creation and Purchases:** Complete transactions using [Stripe] for secure, seamless payments.
- **Order History:** View past purchases and maintain a record of all transactions.
- **Event Notifications:** Leverage events to notify users of updates, offers, or important news in real-time.
- **TypeScript Integration:** The project is beginner-friendly and uses lightweight TypeScript for development.
- **Tailwind:** User-friendly layout comprehensible to everyone.
- **JsDoc:** BuiltIn VsCode jsDoc documentation.

## Project Documentation

This is a [Next.js](https://nextjs.org/) project.

[Ready-to-use backend and Admin panel](https://doc.oneentry.cloud/ 'Documentations OneEntry Headless CMS')

[NPM SDK](https://oneentry.cloud/instructions/npm 'NPM SDK OneEntry Headless CMS')

For detailed information about specific aspects of the project, please refer to the documentation files:

- [Animations](docs/Animations.md) - Details about the GSAP animation system and components
- [Authorization](docs/Authorization.md) - Information about JWT tokens and AuthContext
- [Error Handling](docs/ErrorHandling.md) - Guide to the centralized error handling system
- [Events](docs/Events.md) - Explanation of event notifications and WebSocket usage
- [Appointment Booking Flow](docs/OrderFlow.md) - How the appointment booking process works
- [State Management](docs/StateManagement.md) - Redux Toolkit and state management approach
- [User State](docs/UserState.md) - How user state is implemented and synchronized

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

`1. Rename .env_example to .env`

`2. Add the following environment variables`

    `NEXT_PUBLIC_PROJECT_URL: https://xxx-xxx-xxx.oneentry.cloud`

    `NEXT_PUBLIC_APP_TOKEN: xxxxxGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....`

## Run Locally

Clone the project

```bash
  git clone git@github.com:OneEntry/nextjs-shop-demo.git
```

Go to the project directory

```bash
  cd nextjs-shop-demo
```

Install dependencies

```bash
  npm install
```

Start the dev server

```bash
  next dev
```

Build app

```bash
  next build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Installation

Install oneentry-next-shop with npm

```bash

  cd nextjs-shop-demo

  npm install

  next dev
````

## i18n config

  Open i18n-config.ts
  Set your languages codes ​​accordingly with example

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## Project Structure

`app`: Contains the main components of the application, organized by functionality (e.g., cart, favorites, orders, shop).
`api`: Houses API endpoints and related files, ensuring a clean separation of concerns.
`store`: Manages the Redux store, including hooks, providers, and reducers.
`styles`: Contains CSS files, organized by functionality.
`types`: Includes TypeScript type definitions.
`components`: Features reusable components like forms, icons, and layout elements.

## Development Tools

Scripts: Use npm run dev to start development, npm run build to compile the project, and npm run start to run the production build. The npm run lint script helps maintain code quality.
Environment Variables: Make sure to set up your .env file with the necessary environment variables to run the project smoothly.
Internationalization: The project supports multiple languages, configured in i18n-config.ts.

### Important files and folders

| File(s) / Folder(s)             | Description                                |
| ------------------------------- | ------------------------------------------ |
| `.env`                          | OneEntry CMS project configuration         |
| `i18n-config.ts`                | i18n config                                |
|                                 |                                            |
| `@/app`                         | Next.js app entry points                   |
| `@/app/[lang]/layout.tsx`       | Main layout                                |
| `@/app/[lang]/dictionaries.tsx` | Dictionaries for translations              |
| `@/app/animations`              | Gsap animations transition providers       |
| `@/app/api`                     | API, methods and hooks definition          |
| `@/app/store`                   | Redux-Toolkit management and core reducers |
| `@/app/store/providers`         | React contexts and providers               |
| `@/app/types`                   | Types for TypeScript                       |
|                                 |                                            |
| `@/components`                  | All app components                         |
| `@/components/forms`            | All app forms                              |
| `@/components/icons`            | Svg icons with additional props            |
| `@/components/layout`           | All app layouts                            |
| `@/components/pages`            | Simple app pages                           |
| `@/components/shared`           | Shared between layouts components          |
|                                 |                                            |
| `/public`                       | Public content folder                      |
| ------------------------------- | ------------------------------------------ |

## Detailed docs

This is the central hub for all documentation. Below are links to specific sections.

### Authorization

- [Authorization Documentation](./documentation/Authorization.md)
- Covers login, sign-up, token management, and account activation.

### Orders

- [Orders Documentation](./documentation/OrderFlow.md)
- Details order creation, tracking, and transaction handling.

### Events

- [Events Documentation](./documentation/Events.md)
- Explains real-time updates and event triggers.

### State

- [State Documentation](./documentation/UserState.md)
- Describes user state management and synchronization.

---

In case of any issues or questions, you can post:
[GitHub discussion for React Native][discussion]

[discussion]: https://oneentry.cloud/
[stripe]: https://stripe.com/

## License

[MIT](https://choosealicense.com/licenses/mit/)
