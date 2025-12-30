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

## Getting Started with OneEntry

Before running the demo locally, you need to create a OneEntry account and generate your API credentials.  
A detailed step-by-step setup guide is available on the template landing page:

👉 https://oneentry-free-template-e-commerce-nextjs.vercel.app/

### 1. Create a OneEntry Workspace

If you don’t have an account yet, sign up here  
👉 https://oneentry.cloud/

Create your workspace — this will be the backend for the demo Next.js store.

### 2. Generate an App Token

Once inside the admin panel:

1. Navigate to **Settings → Access Tokens**
2. Click **Create App Token**
3. Copy your generated token — you'll need it for running the project
4. (Optional) Configure access scopes depending on your use case

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

`1. Rename .env_example to .env`

`2. Add the following environment variables`

    `NEXT_PUBLIC_PROJECT_URL: https://xxx-xxx-xxx.oneentry.cloud`

    `NEXT_PUBLIC_APP_TOKEN: xxxxxGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....`

## Run Locally

Clone the project

```bash
  git clone git@github.com:ONEENTRY-PLATFORM/nextjs-shop-demo.git
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
```

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

## Testing

The project includes comprehensive testing setup using modern testing frameworks.

### Testing Frameworks

- **Playwright** - End-to-end testing framework for browser automation
- **Jest** - Unit testing framework with React Testing Library integration

### E2E Tests (Playwright)

End-to-end tests ensure that critical user flows work correctly across different browsers.

#### Available E2E Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Run tests in specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# View test report
npm run test:e2e:report

# Install Playwright browsers (first time setup)
npm run test:e2e:install
```

#### E2E Test Configuration

- Tests are located in [tests/e2e/](tests/e2e/)
- Configuration file: [playwright.config.ts](playwright.config.ts)
- Supports multiple browsers: Chromium, Firefox, WebKit
- Mobile testing: Pixel 5, iPhone 12
- Automatic dev server startup before tests
- Screenshots and videos on failure
- Traces for debugging failed tests

### Unit Tests (Jest)

Unit tests verify individual components and functions in isolation.

#### Available Unit Test Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Unit Test Configuration

- Jest configuration with React Testing Library
- TypeScript support via ts-jest
- jsdom environment for DOM testing
- Test files: `*.test.ts` or `*.spec.ts` (outside node_modules)

### Writing Tests

When contributing to the project, please ensure:

1. **E2E Tests** - Add tests for new user-facing features
2. **Unit Tests** - Add tests for new utility functions and components
3. **Test Coverage** - Maintain good test coverage for critical paths
4. **Test Naming** - Use descriptive test names that explain the expected behavior

### Important Files and Folders

| File(s) / Folder(s)             | Description                                           |
| ------------------------------- | ----------------------------------------------------- |
| **Configuration Files**         |                                                       |
| `.env`                          | OneEntry CMS project configuration and API tokens     |
| `i18n-config.ts`                | Internationalization configuration and locales        |
| `next.config.js`                | Next.js framework configuration                       |
| `tailwind.config.js`            | Tailwind CSS configuration                            |
| `tsconfig.json`                 | TypeScript compiler configuration                     |
| `playwright.config.ts`          | Playwright E2E testing configuration                  |
| `package.json`                  | Project dependencies and scripts                      |
| **Application Structure**       |                                                       |
| `app/`                          | Next.js app directory with entry points               |
| `app/[lang]/layout.tsx`         | Root layout component with internationalization       |
| `app/[lang]/dictionaries.tsx`   | Translation dictionaries loader                       |
| `app/animations/`               | GSAP animation providers and transitions              |
| `app/api/`                      | API endpoints, methods, and React Query hooks         |
| `app/store/`                    | Redux Toolkit store, reducers, and slices             |
| `app/store/providers/`          | React context providers and wrappers                  |
| `app/types/`                    | TypeScript type definitions and interfaces            |
| **Components**                  |                                                       |
| `components/`                   | Reusable React components                             |
| `components/forms/`             | Form components and input elements                    |
| `components/icons/`             | SVG icon components with props                        |
| `components/layout/`            | Layout components (header, footer, navigation)        |
| `components/pages/`             | Page-specific components                              |
| `components/shared/`            | Shared components used across multiple layouts        |
| **Testing**                     |                                                       |
| `tests/e2e/`                    | Playwright end-to-end tests                           |
| `tests/e2e/helpers/`            | Test helper functions and utilities                   |
| `tests/e2e/fixtures/`           | Test data and fixtures                                |
| **Assets**                      |                                                       |
| `public/`                       | Static assets (images, fonts, etc.)                   |
| `styles/`                       | Global CSS and style files                            |
| **Documentation**               |                                                       |
| `docs/`                         | Detailed documentation for specific features          |

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
