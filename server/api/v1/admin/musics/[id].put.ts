import { MusicService } from "../../../../services/MusicService";
const Service = new MusicService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "PUT") {
    return await Service.update(event);
  }
});
