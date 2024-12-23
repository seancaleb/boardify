# Boardify

A full-stack (task board tracker) web application built on top TypeScript using the MERN stack.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)

## Technologies Used

### Client

- TypeScript
- React Query
- Zustand
- React Hook Form
- React Router
- shadcn/ui
- Zod
- Tailwind CSS
- Framer Motion
- Vite

### Server

- TypeScript
- Node.js
- Express.js
- MongoDB
- JWT
- Zod
- Cloudinary

## Features

### 1. Users

- Enables Sign In/Sign Out/Sign Up.
- Able to perform CRUD operations on profile.
- Password modification
- Account deletion

### 2. Boards

- Allow creating multiple boards that can contain one or more tasks
- Permit edit and deletion of board/s

### 3. Tasks

- Allow creating multiple tasks within a single board
- Allow edit and deletion of task/s
- Track tasks based on their status and priority

## Installation

### 1. Clone this repository

```bash
git clone <REPO_NAME> <YOUR_PROJECT_NAME>
```

- Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.

- Run `npm install` for both `client` and `server` directories in order to install the necessary dependencies of the project.

### 2. Setting up the project

- Move to the `client` directory and create a `.env` file:

```bash
VITE_DEV_URL=                  // <local-dev-url-client>
VITE_DEV_API_URL=              // <local-dev-url-server>
VITE_URL=                      // <prod-url-client>
VITE_API_URL=                  // <prod-url-server>
```

- Move to the `server` directory and create a `.env.development` and `.env.production`file:

```bash
PORT=                          // <app-port-number>
SALT_WORK_FACTOR=              // <bcrypt-work-factor>
MONGO_PATH=                    // <your-mongo-uri-path>
ACCESS_TOKEN=                  // <your-access-token>
REFRESH_TOKEN=                 // <your-refresh-token>
ACCESS_TOKEN_EXPIRES_IN=       // <access-token-expiration>
REFRESH_TOKEN_EXPIRES_IN=      // <refresh-token-expiration>
DEFAULT_AVATAR                 // <default-avatar-url>
CLOUD_KEY                      // <your-cloud-key>
CLOUD_NAME                     // <your-cloud-name>
CLOUD_SECRET                   // <your-cloud-secret>
CLOUDINARY_URL                 // <your-cloud-cloudinary-url>
```

### 4. Running the project

- Move to the `client` directory and start the client:

```bash
npm run dev
```

- Move to the `server` directory and start the server:

```bash
npm run dev
```

### 5. Building the project

1. To build the project, run the following from both `client` and `server` directory:

```bash
npm run build
```

2. Start the project in production mode for `client`:

```bash
npm run preview
```

3. Start the project in production mode for `server`:

```bash
npm run start
```
