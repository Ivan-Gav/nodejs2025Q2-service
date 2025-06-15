# REST service: Logging & Error Handling and Authentication and Authorization

This task is a part of the [RSSchool Node.js Course](https://rs.school/courses/nodejs) 2025.

[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/logging-error-authentication-authorization/assignment.md)

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

Other

take a look into `package.json` to see full list of scripts
