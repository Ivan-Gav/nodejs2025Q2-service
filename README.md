# REST service: Containerization, Docker and Database & ORM

This task is a part of the [RSSchool Node.js Course](https://rs.school/courses/nodejs) 2025.

[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md)

### Prerequisites

- Docker installed (Docker Desktop recommended)
- Postgres installed

### Installation

- clone this repo
- run `npm install` to install dependencies
- create `.env` file in the root directory (copy from .env.example)
- run `docker-compose -f docker-compose.test.yml up` to run container from image
- after testing run `docker-compose -f docker-compose.test.yml down` for clean up

### Scripts

To run app locally without Docker

- change `POSTGRES_HOST` in `.env` to **localhost**
- run `createdb -U {username} -h localhost -p {port} {database_name}` to create database
- alternatively you can create it using pgAdmin
- run `npm run start:dev` to start app
- open another terminal and `run npm run migration:run` to apply initial migration

Start app

- `npm run start:dev` - start in dev mode
- `npm run build` - build app
- `npm run start:prod` - start in production mode

Tests

- `npm run test`
- `npm run test test/albums.e2e.spec.ts`
- `npm run test test/artists.e2e.spec.ts`
- `npm run test test/favorites.e2e.spec.ts`
- `npm run test test/tracks.e2e.spec.ts`
- `npm run test test/users.e2e.spec.ts`

Other

take a look into `package.json` to see full list of scripts
