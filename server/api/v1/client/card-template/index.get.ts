import { WeddingCardService } from "~~/server/services/CardTemplateService";
import { UserData } from "~~/server/data/user";

const service = new WeddingCardService();
const userRepo = new UserData();

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const sessionUser = session?.user as any;
  const email = sessionUser?.email;

  const query = getQuery(event);

  if (email) {
    const user = await userRepo.checkUserNormal(email);
    if (user && query.is_template !== "true" && query.is_template !== true) {
      // Modifying query here is fine as getQuery might be called again in service,
      // but let's check service implementation. 
      // service.getList calls getQuery(event). We need it to use OUR modified query.
      event.context.query = { ...query, id_user: user.id };
    }
  }

  return await service.getList(event);
});
