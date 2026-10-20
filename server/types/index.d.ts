import { Queue } from "bullmq";

declare module "nitropack" {
  interface NitroApp {
    emailQueue: Queue;
  }
}

export {};
