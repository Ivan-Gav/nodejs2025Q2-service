export const USER_NOT_FOUND = (id: string) => `User ${id} not found`;
export const LOGIN_ALREADY_USED = (login: string) =>
  `Login '${login}' is already taken`;
export const WRONG_PASSWORD = (password: string) =>
  `Wrong password: ${password}`;
export const ARTIST_ALREADY_EXISTS = (name: string) =>
  `Artist ${name} already exists`;
export const ARTIST_NOT_FOUND = (id: string) => `Artist ${id} not found`;
export const ALBUM_ALREADY_EXISTS = (name: string) =>
  `Artist already has album named ${name}`;
export const ALBUM_NOT_FOUND = (id: string) => `Album ${id} not found`;
