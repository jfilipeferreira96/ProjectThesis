# Project SCORE

## Description
Check the following video: https://youtu.be/rfn3fCYnIrs

### Running the Project

#### 1. Manual Setup

**Backend:** 

```bash
cd ./backend
yarn install
yarn dev
```

**Frontend:**

```bash
cd ./frontend
yarn install
yarn dev
```

**Note:** Make sure to set up local environment variables in `.env` files.

#### 2. Using Docker

```bash
docker-compose up -d 
```

**Note:** Pay attention to `mongo-init.js`, which creates default users and sets the database name.
