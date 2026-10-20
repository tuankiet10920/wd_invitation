import { AcceptInvitationService } from "~~/server/services/AcceptInvitationService";

const Service = new AcceptInvitationService();

export default defineEventHandler(async (event) => {
  return await Service.list(event);
});
