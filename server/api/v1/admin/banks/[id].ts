import { BankService } from "~~/server/services/BankService";

const Service = new BankService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case "GET":
      return await Service.getDetail(event);
    case "PUT":
      return await Service.update(event);
    case "DELETE":
      return await Service.delete(event);
  }
});
