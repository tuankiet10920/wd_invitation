import { AuthService } from "~~/server/services/AuthService";

const Auth = new AuthService();

export default defineEventHandler((event) => {
  return Auth.login(event);
});
