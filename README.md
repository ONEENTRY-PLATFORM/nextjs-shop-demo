
![Logo](https://doc.oneentry.cloud/img/logo.svg)


# OneEntry next.js shop example

A brief description of what this project does and who it's for


## Demo

https://oneentry-next-shop.vercel.app/en


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


## Documentation
This is a [Next.js](https://nextjs.org/) project.

Admin
[https://doc.oneentry.cloud/](https://doc.oneentry.cloud/)

SDK
[https://oneentry.cloud/instructions/npm](https://oneentry.cloud/instructions/npm)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

`1. Rename .env_example to .env`

`2. Add the following environment variables`

    `PROJECT_URL: https://xxx-xxx-xxx.oneentry.cloud`

    `APP_TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....`


## Run Locally

Clone the project

```bash
  git clone https://oneentry-next-shop.git
```

Go to the project directory

```bash
  cd oneentry-next-shop
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  next dev
```

Build app

```bash
  next build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
```

## Installation

Install oneentry-next-shop with npm

```bash

  cd oneentry-next-shop

  npm install

  next dev
```
    
## Deployment

To deploy this project run

```bash
  npm run deploy
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

### Important files and folders

| File(s) / Folder(s)       | Description                                          |
|---------------------------|------------------------------------------------------|
| `.env`                    | OneEntry CMS project configuration                   |
| `@/app`                   | Next.js app entry points                             |
| `@/app/animations`        | Gsap animations transition providers                 |
| `@/app/api`               | API, methods and hooks definition                    |
| `@/app/store`             | Redux-Toolkit management and core reducers           |
| `@/app/store/providers`   | React contexts and providers                         |
| `@/app/types`             | Types for TypeScript                                 |
| `@/components`            | All app components                                   |
| `@/components/forms`      | All app forms                                        |
| `@/components/icons`      | Svg icons with additional props                      |
| `@/components/layout`     | All app layouts                                      |
| `@/components/pages`      | Simple app pages                                     |
| `@/components/shared`     | Shared between layouts components                    |
| `/public`                 | Public content folder                                |
