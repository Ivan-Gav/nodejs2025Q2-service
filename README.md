# Home Library Service (REST Service)

This task is a part of the [RSSchool Node.js Course](https://rs.school/courses/nodejs) 2025.

[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md)

### Installation

- clone this repo
- run `npm install` to install dependencies
- create `.env` file in the root directory (copy from .env.example)

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
