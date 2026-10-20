// types/auth.d.ts
import type { Role } from "~~/interfaces";

declare module "#auth-utils" {
  interface User {
    name: string;
    image: string;
    role: Role;
    email?: string;
    remember: boolean;
  }
}

export {};
