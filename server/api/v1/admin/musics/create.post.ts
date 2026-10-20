import { MusicService } from "../../../../services/MusicService";
const Service = new MusicService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "POST") {
    return await Service.create(event);
  }
});
