# REST service: Containerization, Docker and Database & ORM

This task is a part of the [RSSchool Node.js Course](https://rs.school/courses/nodejs) 2025.

[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md)

### Prerequisites

I didn't manage to acomplish the Docker part. To run the app you have to install the database locally. If you don't have Postgres installed on your PC please [install](https://www.postgresql.org/download/) it. I am sorry for inconvenience.

### Installation

- clone this repo
- run `npm install` to install dependencies
- create `.env` file in the root directory (copy from .env.example)
- run `createdb -U {username} -h localhost -p {port} {database_name}` to create database
- alternatively you can create it using pgAdmin
- run `npm run start:dev` to start app
- open another terminal and run `npm run migration:run` to apply initial migration

### Scripts

Start app

- `npm run start:dev` - start in dev mode
- `npm run build` - build app
- `npm run start:prod` - start in production mode

Tests

**Important: tests are e2e. Please make sure to (re)start the app before running them!**

- `npm run test`
- `npm run test test/albums.e2e.spec.ts`
- `npm run test test/artists.e2e.spec.ts`
- `npm run test test/favorites.e2e.spec.ts`
- `npm run test test/tracks.e2e.spec.ts`
- `npm run test test/users.e2e.spec.ts`

Other

take a look into `package.json` to see full list of scripts
