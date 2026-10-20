import { MusicService } from "~~/server/services/MusicService";

const service = new MusicService();

export default defineEventHandler(async (event) => {
  return await service.cloneMusics(event);
});
