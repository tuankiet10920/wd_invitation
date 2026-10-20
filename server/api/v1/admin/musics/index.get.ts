import { MusicService } from "../../../../services/MusicService";
const Service = new MusicService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    return await Service.getList(event);
  }
});
